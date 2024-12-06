import Quiz from '../../client/src/components/Quiz';

describe('<Quiz>', () => {
  beforeEach(() => {
    cy.fixture('questions.json').then((fixture) => {
      cy.intercept('GET', '/api/questions/random', fixture).as('questionsArray');
    });
  });

  it('should render the Quiz component', () => {
    cy.mount(<Quiz />);
  });

  it('should display a "Start Quiz" button if the quiz has not been started', () => {
    cy.mount(<Quiz />);
    cy.get('button').should('have.text', 'Start Quiz');
  });

  it('should display the first question and answer set when the "Start Quiz" button is clicked', () => {
    cy.mount(<Quiz />);
    cy.get('button').click(); // Start quiz
    cy.wait('@questionsArray');
    cy.get('h2').should('have.text', 'What is the capital of France?');
    cy.get('.card')
      .children()
      .eq(1)
      .children()
      .eq(2)
      .children()
      .eq(1)
      .should('have.text', 'Paris');
  });

  it('should advance to the next question when the current question is answered', () => {
    cy.mount(<Quiz />);
    cy.get('button').click(); // Start quiz
    cy.wait('@questionsArray');
    cy.get('h2').should('have.text', 'What is the capital of France?');
    cy.get('button').first().click(); // Answer first question
    cy.get('h2').should('have.text', 'What is 2 + 2'); // Next question
  });

  it('should display the correct results and a button to take a new quiz after the final question is answered', () => {
    cy.mount(<Quiz />);
    cy.get('button').click(); // Start quiz
    cy.wait('@questionsArray');
    cy.get('button').first().click(); // Answer first question
    cy.get('button').first().click(); // Answer second question
    cy.get('button').first().click(); // Answer third question
    cy.get('h2').should('have.text', 'Quiz Completed'); // End of quiz
    cy.get('.alert-success').should('have.text', 'Your score: 0/3'); // Check score
    cy.get('button').should('have.text', 'Take New Quiz').click(); // Start new quiz
    cy.wait('@questionsArray');
    cy.get('button').eq(1).click(); // Answer first question
    cy.get('button').eq(3).click(); // Answer second question
    cy.get('button').eq(2).click(); // Answer third question
    cy.get('.alert-success').should('have.text', 'Your score: 3/3'); // Final score
  });
});
