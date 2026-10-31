import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync} from 'node:fs';
import {buildSync} from 'esbuild';
const {examples}=JSON.parse(readFileSync('docs/catalog/navigation-provenance.json'));
for(const e of examples){
 const script=e.js?buildSync({entryPoints:[e.js],bundle:true,write:false,format:'iife'}).outputFiles[0].text:null;
 test(`${e.component}/${e.id}`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:500,height:720});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>${e.title}</title><body><main>${readFileSync(e.html,'utf8')}</main></body></html>`);
  await page.addStyleTag({path:'dist/css/fokus.css'});if(e.css)await page.addStyleTag({path:e.css});if(script)await page.addScriptTag({content:script});
  const trigger=page.locator(`[data-fs="${e.component}"]`);
  if(e.id==='responsive-states'){
   const button=page.locator('.fs-navbar-toggler'),panel=page.locator('.fs-navbar-collapse');
   await expect(panel).toBeHidden();await button.click();await expect(panel).toBeVisible();await panel.locator('a').first().focus();await page.keyboard.press('Escape');await expect(button).toBeFocused();await expect(panel).toBeHidden();
   await page.setViewportSize({width:900,height:720});await expect(panel).toBeVisible();await expect(button).toBeHidden();await expect(panel).toHaveAttribute('hidden','');
  }else if(e.component==='breadcrumb'){
   const more=page.getByRole('button',{name:'Mostrar níveis ocultos'});await expect(more).toBeVisible();await more.click();await expect(page.locator('.fs-dropdown-menu.is-open')).toBeVisible();await page.keyboard.press('Escape');await expect(more).toBeFocused();await page.setViewportSize({width:900,height:720});await expect(more).toHaveCount(0);await expect(page.locator('a[href="#nivel1"]')).toBeVisible();
  }else if(e.component==='nested-menu'){
   await trigger.click();await page.mouse.move(490,700);await expect(page.getByRole('menuitem',{name:'Novo',exact:true})).toBeFocused();await page.keyboard.press('ArrowDown');await expect(page.getByRole('menuitem',{name:'Exportar',exact:true})).toBeFocused();await page.keyboard.press('ArrowRight');await expect(page.getByRole('menuitem',{name:'Formato',exact:true})).toBeFocused();await page.keyboard.press('ArrowRight');await expect(page.getByRole('menuitem',{name:'PDF',exact:true})).toBeFocused();await page.keyboard.press('Escape');await expect(page.getByRole('menuitem',{name:'Formato',exact:true})).toBeFocused();await page.keyboard.press('ArrowLeft');await expect(page.getByRole('menuitem',{name:'Exportar',exact:true})).toBeFocused();await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
  }else if(e.component==='tree-view'){
   const root=page.locator('[data-value="src"]');await expect(root).toHaveAttribute('aria-expanded','true');await root.focus();await page.keyboard.press('ArrowRight');await expect(page.locator('[data-value="index"]')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#tree-status')).toHaveText('Selecionado: index');await page.keyboard.press('Home');await page.keyboard.press('ArrowLeft');await expect(root).toHaveAttribute('aria-expanded','false');await page.keyboard.press('End');await expect(page.locator('[data-value="readme"]')).toBeFocused();
  }else if(e.component==='command-palette'){
   await page.keyboard.press('Control+Shift+p');const input=page.getByRole('combobox');await expect(input).toBeFocused();await input.fill('zzzz');await expect(page.locator('[data-fs-empty]')).toBeVisible();await expect(input).not.toHaveAttribute('aria-activedescendant',/.+/);await input.fill('Config');await page.keyboard.press('Enter');await expect(page.locator('#command-status')).toHaveText('Selecionado: settings');await expect(trigger).toBeFocused();await trigger.click();await expect(input).toHaveValue('');await page.keyboard.press('ArrowDown');await expect(input).toHaveAttribute('aria-activedescendant',await page.locator('[data-value="settings"]').getAttribute('id'));await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
  }else if(e.component==='scrollspy'){
   const link=trigger.locator('a').last();await link.focus();const href=await link.getAttribute('href');await page.locator(href).evaluate(el=>window.scrollTo(0,el.offsetTop-innerHeight*.25));await expect(link).toHaveClass(/is-active/);await expect(link).toHaveAttribute('aria-current','location');await expect(link).toBeFocused();
  }else{
   const current=page.locator('[aria-current="page"]');await expect(current).toHaveCount(1);await current.focus();await expect(current).toBeFocused();await expect(page.locator('[aria-disabled="true"][href]')).toHaveCount(0);
   if(e.id==='local-tokens')expect(await current.evaluate(el=>getComputedStyle(el).paddingBlockStart)).toBe('12px');
   if(e.component==='pagination')expect(await current.evaluate(el=>parseFloat(getComputedStyle(el).minBlockSize))).toBe(e.id==='bordered-small'?26:40);
  }
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()).violations).toEqual([]);
  if(script){await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await page.addScriptTag({content:script});await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));}
  expect(errors).toEqual([]);
 });
}
