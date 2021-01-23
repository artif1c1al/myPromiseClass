const ArtemPromise = require('./promise')

describe('Artem Promise', () => {
  let promise
  let executorSpy

  const successResult = 42
  const errorResult = 'I am error'

  beforeEach(() => {
    executorSpy = jest.fn((r) => setTimeout(() => r(successResult), 150))
    promise = new ArtemPromise(executorSpy)
  })

  test('should exist and to be type of function', () => {
    expect(ArtemPromise).toBeDefined()
    expect(typeof ArtemPromise).toBe('function')
  });

  test('should have then, catch, finaly methods', () => {
    expect(promise.then).toBeDefined()
    expect(promise.catch).toBeDefined()
    expect(promise.finally).toBeDefined()
  });

  test('should call executor function', () => {
    expect(executorSpy).toHaveBeenCalled()
  });

  test('should get data in then block and chain them', async () => {
    const result = await promise.then(num => num).then(num => num * 2)
    expect(result).toBe(successResult * 2)
  })

  test('should catch error', () => {
    const errorExecutor = (_, reject) => setTimeout(() => {
      reject(errorResult)
    }, 150)

    const errorPromise = new ArtemPromise(errorExecutor)

    return new Promise((resolve) => {
      errorPromise.catch(error => {
        expect(error).toBe(errorResult)
        resolve()
      })
    })
  });

  test('should call finally method', async () => {
    const finallySpy = jest.fn(() => {})
    await promise.finally(finallySpy)

    expect(finallySpy).toHaveBeenCalled()
  })
})
