import {expect} from '@playwright/test';
import {test} from '../../umbraco/helpers';
import {PartialViewBuilder} from "../../umbraco/builders";

test.describe('Relation Types', () => {

  test.beforeEach(async ({page, umbracoApi}) => {
    await umbracoApi.login();
  });

  test('Create relation type', async ({page, umbracoApi, umbracoUi}) => {
    const name = "Test relation type";

    await umbracoApi.relationTypes.ensureNameNotExists(name);

    await umbracoUi.goToSection('settings');
    await umbracoUi.waitForTreeLoad('settings');

    await umbracoUi.clickElement(umbracoUi.getTreeItem("settings", ["Relation Types"]), {button: "right"});

    await umbracoUi.clickElement(umbracoUi.getContextMenuAction("action-create"));

    const form = await page.locator('form[name="createRelationTypeForm"]');
    
    await form.locator('input[name="relationTypeName"]').type(name);
    await form.locator('[name="relationType-direction"] input').first().click({force: true});
    await page.selectOption('select[name="relationType-parent"]', {label: "Document"});
    await page.selectOption('select[name="relationType-child"]', {label: "Media"});
    await form.locator('[name="relationType-isdependency"]').last().click({force: true});
    await form.locator('.btn-primary').click();
    
    await page.waitForNavigation();

    expect(page.url()).toContain("#/settings/relationTypes/edit/");

    //Clean up
    await umbracoApi.relationTypes.ensureNameNotExists(name);
  });
});
