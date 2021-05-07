export default class GroupModal {
  private openButton = "openCreateGroupModal";
  private nameInput = "groupNameInput";
  private createButton = "createGroup";
  private renameButton = "renameGroup";

  open(name?: string) {
    cy.get(`[data-testid=${name || this.openButton}]`).click();
    return this;
  }

  fillGroupForm(name = "") {
    cy.get("[data-testid=groupNameInput]").clear().type(name);
    return this;
  }

  clickCreate() {
    cy.getId(this.createButton).click();
    return this;
  }

  clickRename() {
    cy.getId(this.renameButton).click();
    return this;
  }
}
