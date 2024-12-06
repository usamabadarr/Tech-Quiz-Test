describe('Quiz cycle', () => {

  context('Beginning quiz', () => {
    // Intercept fetch for Quiz questions/answers and visit page
    beforeEach(() => {
      cy.fixture('questions.json').then((fixture) => {
        cy.intercept('GET', '/api/questions/random', { 
          statusCode: 200,
          body: fixture
        }).as('questionsArray')
      })
      cy.visit('/')
    })

    it('should arrive at the home page and see a start quiz button when visited', () => {
      cy.contains('Start Quiz')
    })

    it('should get question/answer data and render the first question when the quiz is started', () => {
      cy.contains('Start Quiz').click()
      cy.wait('@questionsArray').its('response.statusCode').should('eq', 200)
      cy.contains('Test question 1').should('be.visible')
    })
  })

  context('Completing quiz', () => {
    // Shortcut to final question, answering first two questions correctly.
    beforeEach(() => {   
      cy.fixture('questions.json').then((fixture) => {
        cy.intercept('GET', '/api/questions/random', { 
          statusCode: 200,
          body: fixture
        }).as('questionsArray')
      })
      cy.visit('/')
      cy.contains('Start Quiz').click()
      cy.wait('@questionsArray')
      cy.get('button').eq(1).click() // Answer 1st question
      cy.get('button').eq(3).click() // Answer 2nd question
    })

    it('should display the correct score when you answer the final question correctly', () => {
      cy.get('button').eq(2).click() // Answer final question
      cy.contains('Your score: 3/3').should('be.visible')
    })

    it('should display the correct score when you answer the final question incorrectly', () => {
      cy.get('button').eq(1).click() // Answer final question incorrectly
      cy.contains('Your score: 2/3').should('be.visible')
    })
  })

  context('Starting new quiz', () => {
    // Shortcut to results, ready to click the button for a new test
    beforeEach(() => {   
      cy.fixture('questions.json').then((fixture) => {
        cy.intercept('GET', '/api/questions/random', { 
          statusCode: 200,
          body: fixture
        }).as('questionsArray')
      })
      cy.visit('/')
      cy.contains('Start Quiz').click()
      cy.wait('@questionsArray')
      cy.get('button').eq(1).click() // Answer 1st question
      cy.get('button').eq(3).click() // Answer 2nd question
      cy.get('button').eq(2).click() // Answer 3rd question
    })

    it('should restart the quiz with the same questions and answers after clicking "Take New Quiz"', () => {
      cy.contains('Take New Quiz').click() // Restart quiz
      cy.wait('@questionsArray').its('response.statusCode').should('eq', 200)
      cy.get('button').eq(1).click() // Answer 1st question again
      cy.get('button').eq(3).click() // Answer 2nd question again
      cy.get('button').eq(2).click() // Answer 3rd question again
      cy.contains('Your score: 3/3').should('be.visible') // Score check
    })
  })
})

  