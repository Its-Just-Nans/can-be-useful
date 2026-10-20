describe("Interface tests", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("Check if online", () => {
        // beforeEach
    });

    it("Connect", () => {
        cy.get("input").type("PASSWORD");
        cy.get("button").click();
        cy.contains("Auto-Form");
    });

    it("Text input", () => {
        cy.get("input").type("PASSWORD");
        cy.get("button").click();
        cy.contains("Auto-Form");

        cy.contains("Identité - papiers - citoyenneté").click();
        cy.contains("Généralités").click();
        cy.wait(500);
        cy.get("input").first().type("Welcome");
    });

    it("Add file", () => {
        cy.get("input").type("PASSWORD");
        cy.get("button").click();
        cy.wait(1000);
        cy.contains("Auto-Form");

        cy.contains("Logement").click();
        cy.contains("Résidence principale").click();
        cy.wait(500);
        cy.fixture("temp.txt").then((fileContent) => {
            cy.get('input[type="file"]').attachFile({
                fileContent: fileContent.toString(),
                fileName: "testPicture.png",
                mimeType: "image/png",
            });
        });
    });
});
