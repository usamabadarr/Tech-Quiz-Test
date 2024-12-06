import Quiz from '../../client/src/components/Quiz';

describe('Tech Quiz Component', () => {
  beforeEach(() => {
    cy.fixture('questions.json').then((mockData) => {
      cy.intercept('GET', '/api/questions/random', mockData).as('loadQuestions');
    });
    cy.mount(<Quiz />);
  });

  it('should render the Quiz component properly', () => {
    cy.get('button').contains('Begin Quiz').should('be.visible');
  });

  it('should display the first question with options after clicking "Begin Quiz"', () => {
    cy.get('button').contains('Begin Quiz').click();
    cy.wait('@loadQuestions');
    cy.get('h2').should('contain.text', 'What is the capital of France?');
    cy.get('.card button').eq(1).should('contain.text', 'Berlin');
  });

  it('should move to the next question after answering the current one', () => {
    cy.get('button').contains('Begin Quiz').click();
    cy.wait('@loadQuestions');
    cy.get('h2').should('contain.text', 'What is the capital of France?');
    cy.get('.card button').eq(0).click();
    cy.get('h2').should('contain.text', 'What is 2 + 2?');
  });

  it('should display the score and allow restarting the quiz after the last question', () => {
    cy.get('button').contains('Begin Quiz').click();
    cy.wait('@loadQuestions');
    cy.get('.card button').eq(0).click();
    cy.get('.card button').eq(1).click();
    cy.get('.card button').eq(2).click();
    cy.get('h2').should('contain.text', 'Quiz Finished');
    cy.get('.alert-success').should('contain.text', 'Your score: 1/3');
    cy.get('button').contains('Restart Quiz').click();
    cy.wait('@loadQuestions');
    cy.get('.card button').eq(2).click();
    cy.get('.card button').eq(0).click();
    cy.get('.card button').eq(1).click();
    cy.get('.alert-success').should('contain.text', 'Your score: 3/3');
  });
});

