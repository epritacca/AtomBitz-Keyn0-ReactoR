const { test, expect } = require("@playwright/test");

test("four-card draw exports and verifies a replayable proof", async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto("/");

  const cards = [
    [1, 2, 3, 4, 5],
    [11, 12, 13, 14, 15],
    [21, 22, 23, 24, 25],
    [31, 32, 33, 34, 35],
  ];

  for (const [cardIndex, picks] of cards.entries()) {
    await page.locator(`[data-card-tab="${cardIndex}"]`).click();
    for (const number of picks) {
      await page.locator(`[data-number="${number}"]`).click();
    }
  }

  await page.locator('[data-card-tab="all"]').click();
  await page.locator("#playRound").click();

  const proofExport = page.locator("#proofExport");
  await expect(proofExport).toHaveValue(/"sessionHash"/, { timeout: 8000 });

  const proofText = await proofExport.inputValue();
  const proof = JSON.parse(proofText);
  expect(proof.version).toBe("atom-bitz-keno-proof-v1");
  expect(proof.playedCards).toEqual([0, 1, 2, 3]);
  expect(proof.draw).toHaveLength(20);
  expect(new Set(proof.draw).size).toBe(20);
  expect(proof.sessionHash).toMatch(/^[a-f0-9]{64}$/);

  await page.locator("#verifyProof").click();
  await expect(page.locator("#proofStatus")).toContainText("Verified R1");
});
