describe('Tech Quiz E2E Tests', () => {
  beforeEach(() => {
    cy.fixture('questions.json').then((mockData) => {
      cy.intercept('GET', '/api/questions/random', mockData).as('loadQuestions');
    });
    cy.visit('/');
  });

  it('should display the first question and answer set when the "Start Quiz" button is clicked', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@loadQuestions');
    cy.get('h2').should('contain.text', 'What is the capital of France?');
    cy.get('.card button').should('have.length', 3); // Check for 3 answer options
  });

  it('should advance to the next question when the current question is answered', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@loadQuestions');
    cy.get('h2').should('contain.text', 'What is the capital of France?');
    cy.get('.card button').eq(0).click(); // Answer first question
    cy.get('h2').should('contain.text', 'What is 2 + 2?'); // Next question
  });

  it('should display the correct results and a button to take a new quiz after the final question is answered', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@loadQuestions');

    // Answer questions
    cy.get('.card button').eq(0).click();
    cy.get('.card button').eq(1).click();
    cy.get('.card button').eq(2).click();

    // Check for quiz completion
    cy.get('h2').should('contain.text', 'Quiz Completed!');
    cy.get('.alert-success').should('contain.text', 'Your score: 3/3');
    cy.get('button').contains('Restart Quiz').click();
    cy.wait('@loadQuestions');
    cy.get('h2').should('contain.text', 'What is the capital of France?'); // Restart quiz
  });
});


  