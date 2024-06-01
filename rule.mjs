const rules = new Map();

const createRuleSelf = (type, selfAttraction) => {
  rules.set(`${type}-${type}`, {attraction: selfAttraction});
};

const createRule = (type1, type2, attractionT1T2) => {
  rules.set(`${type1}-${type2}`, {attraction: attractionT1T2});
};
const createRules = (type1, type2, attractionT1T2, attractionT2T1) => {
  rules.set(`${type1}-${type2}`, {attraction: attractionT1T2});
  rules.set(`${type2}-${type1}`, {attraction: attractionT2T1});
}

const getRule = (type1, type2) => {
  return rules.get(`${type1}-${type2}`);
};

export {createRuleSelf, createRule, createRules, getRule};