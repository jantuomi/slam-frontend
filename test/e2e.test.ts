import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest"
import { preview } from "vite"
import type { PreviewServer } from "vite"
import puppeteer from "puppeteer"
import type { Browser, Page } from "puppeteer"

describe("e2e", async() => {
  let server: PreviewServer
  let browser: Browser
  let page: Page

  beforeAll(async() => {
    server = await preview({ preview: { port: 4000 } })
    browser = await puppeteer.launch()
  })

  beforeEach(async () => {
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
    await server.httpServer.close()
  })

  test("should render the run code button", async() => {
    try {
      await page.goto("http://localhost:3000")
      const runButton = await page.$("#run-button")
      expect(runButton).toBeDefined()

      const text = await page.evaluate(btn => btn.textContent, runButton)
      expect(text).toContain("Run code on server")
    }
    catch (e) {
      console.error(e)
      expect(e).toBeUndefined()
    }
  })

  test("should select example", async() => {
    try {
      await page.goto("http://localhost:3000")
      await page.waitForSelector("#examples-loading", { hidden: true })

      const sourceEditor = await page.$("#source-editor .ace_content")
      expect(sourceEditor).toBeDefined()

      let source = await page.evaluate(editor => editor.textContent, sourceEditor)
      expect(source).not.toContain("2 5 + .")

      const select = await page.$("#example-select")
      expect(select).toBeDefined()

      const firstSelectOptionXPath = "//div[contains(text(), 'Integer sum')]"
      let option = (await page.$x(firstSelectOptionXPath))[0]
      expect(option).not.toBeDefined()

      await select.click()

      option = (await page.$x(firstSelectOptionXPath))[0]
      expect(option).toBeDefined()

      await option.click()
      await page.waitForNetworkIdle()

      source = await page.evaluate(editor => editor.textContent, sourceEditor)
      expect(source).toContain("2 5 + .")
    }
    catch (e) {
      await page.screenshot({ path: "test/screenshots/should select example.png", fullPage: true })
      console.error(e)
      expect(e).toBeUndefined()
    }
  })

  test("should run code", async() => {
    try {
      await page.goto("http://localhost:3000")
      await page.waitForSelector("#examples-loading", { hidden: true })

      await page.evaluate(() => window.dispatchEvent(new Event("resetSourceEditor")))

      const sourceEditor = await page.$("#source-editor textarea")
      expect(sourceEditor).toBeDefined()
      await sourceEditor.type("100 200 + .")

      const runButton = await page.$("#run-button")
      await runButton.click()
      await page.waitForNetworkIdle()

      const resultsEditor = await page.$("#results-editor .ace_content")
      expect(resultsEditor).toBeDefined()

      const results = await page.evaluate(editor => editor.textContent, resultsEditor)
      expect(results).toContain("Output:300")
    }
    catch (e) {
      await page.screenshot({ path: "test/screenshots/should run code.png", fullPage: true })
      console.error(e)
      expect(e).toBeUndefined()
    }
  })
})
