const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

app.post('/execute-test', async (req, res) => {
  const { testCase } = req.body;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    for (const step of testCase.steps) {
      switch (step.action) {
        case 'goto':
          await page.goto(step.url);
          break;
        case 'fill':
          await page.fill(step.selector, step.value);
          break;
        case 'click':
          await page.click(step.selector);
          break;
        case 'expect':
          const el = await page.locator(step.selector);
          const text = await el.textContent();
          if (text !== step.expectedText) throw new Error(`Expected "${step.expectedText}", got "${text}"`);
          break;
      }
    }

    await browser.close();
    res.json({ status: 'passed' });
  } catch (err) {
    await browser.close();
    res.json({ status: 'failed', error: err.message });
  }
});

app.get('/', (_, res) => {
  res.send("Playwright service is running.");
});

app.listen(3000, () => console.log('Server started on port 3000'));
