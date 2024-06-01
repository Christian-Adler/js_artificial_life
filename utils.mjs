function* idMaker() {
  let index = 0;
  while (true) {
    yield index++;
  }
}

const idGen = idMaker();

const getNextId = () => idGen.next().value;


export {getNextId};