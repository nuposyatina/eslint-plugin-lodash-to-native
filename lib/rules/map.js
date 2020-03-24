'use strict';

/**
 * Получить список родительских нод,
 * являющихся условием или тернарным оператором
 * @param {Array} parents список родительских нод
 */
function getParents(parents) {
  return parents.filter(parent => parent.type === 'IfStatement' || parent.type === 'ConditionalExpression')
};

/**
 * Перебрать список родителей и получить текст условия
 * @param {Array} parents родители проверяемой ноды, являющиеся условием или тернарным оператором
 * @param {*} code исходный код проверяемого файла
 */
function getCheckerTexts(parents, code) {
  if (!parents || !parents.length) return [];
  return parents.map(parent => code.getText(parent.test));
}

/**
 * Получить текст, на который заменится проверяемая нода
 * @param {Object} fixer объект, с помощью которого вносим изменения в код
 * @param {Object} fixInfo информация, необходимая для произведения фикса
 */
function getFixText(fixer, fixInfo) {
  const { node, parent, collName, callbackName } = fixInfo;
  const ifStatementText = `if (Array.isArray(${collName})) {
  		return ${collName}.map(${callbackName});
  	} else {
    	return _.map(${collName}, ${callbackName});
  	}`;
  const conditionText = `(Array.isArray(${collName})) ? ${collName}.map(${callbackName}) : _.map(${collName}, ${callbackName})`
  if (parent.type === 'ReturnStatement') {
    return fixer.replaceText(parent, ifStatementText);
  }
  return fixer.replaceText(node, conditionText);
};

module.exports = {
  meta: {
    docs: {
      description: 'Replace lodash map to native method'
    },
    fixable: 'code',
    schema: []
  },
  create(context) {
    const sourceCode = context.getSourceCode()
    return {
      CallExpression(node) {
        if (node.callee.type !== 'MemberExpression') return;
        const { object, property } = node.callee;
        console.log(object.name, property.name)
        if (!(object.name === "_" && property.name === 'map')) return;
        context.report({
          node,
          message: 'Lodash method instead native Array map method',
          fix(fixer) {
            const parents = context.getAncestors(node);
            const [coll, cb] = node.arguments;
            const collName = sourceCode.getText(coll);
            const callbackName = sourceCode.getText(cb);
            const recursiveParents = getParents(parents);
            const texts = getCheckerTexts(recursiveParents, sourceCode);
            //чтобы избежать рекурсивной замены
            if (texts.includes(`Array.isArray(${collName})`)) {
                return;
            }
            const parent = parents[parents.length - 1];
            const fixInfo = {
              node,
              parent,
              collName,
              callbackName
            };
            return getFixText(fixer, fixInfo);
          }
        });
      }
    };
  }
};
