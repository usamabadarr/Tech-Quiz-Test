describe('Tech Quiz E2E Tests', () => {
    beforeEach(() => {
    
      cy.fixture('questions.json').then((mockData) => {
        cy.intercept('GET', '/api/questions/random', mockData).as('loadQuestions');
      });

      cy.visit('/');
    });
  
    it('should display the "Begin Quiz" button on load', () => {
      cy.get('button').contains('Begin Quiz').should('be.visible');
    });
  
    it('should load the first question with answer options', () => {
      cy.get('button').contains('Begin Quiz').click();
      cy.wait('@loadQuestions');
      cy.get('h2').should('contain.text', 'What is the capital of France?');
      cy.get('.card button').eq(1).should('contain.text', 'Berlin');
    });
  
    it('should navigate to the next question after selecting an answer', () => {
      cy.get('button').contains('Begin Quiz').click();
      cy.wait('@loadQuestions');
      cy.get('h2').should('contain.text', 'What is the capital of France?');
      cy.get('.card button').eq(0).click();
      cy.get('h2').should('contain.text', 'What is 2 + 2?');
    });
  
    it('should show the final score after completing the quiz', () => {
      cy.get('button').contains('Begin Quiz').click();
      cy.wait('@loadQuestions');
  
      cy.get('.card button').eq(0).click();
      cy.get('.card button').eq(1).click();
      cy.get('.card button').eq(2).click();
  
      cy.get('h2').should('contain.text', 'Quiz Completed!');
      cy.get('.alert-success').should('contain.text', 'Your score: 1/3');
    });
  
    it('should restart the quiz and allow a new attempt', () => {
      cy.get('button').contains('Begin Quiz').click();
      cy.wait('@loadQuestions');
  
      cy.get('.card button').eq(0).click();
      cy.get('.card button').eq(1).click();
      cy.get('.card button').eq(2).click();
  
      cy.get('button').contains('Restart Quiz').click();
      cy.wait('@loadQuestions');
  
      cy.get('.card button').eq(2).click();
      cy.get('.card button').eq(0).click();
      cy.get('.card button').eq(1).click();
  
      cy.get('.alert-success').should('contain.text', 'Your score: 3/3');
    });
  });
  