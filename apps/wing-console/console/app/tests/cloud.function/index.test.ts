import { expect, test } from "@playwright/test";

import { describe } from "../describe.js";
import { getResourceNode } from "../helpers.js";

describe(new URL("index.w", import.meta.url), () => {
  test("executes function and shows response", async ({ page }) => {
    await getResourceNode(page, "root/Default/cloud.Function").click();

    await page.getByTestId("cloud.function:invoke").click();

    expect(
      await page.getByTestId("cloud.function:response").textContent(),
    ).toEqual(
      JSON.stringify(
        {
          success: true,
          response: "Hello world!",
        },
        undefined,
        2,
      ),
    );
  });
});
