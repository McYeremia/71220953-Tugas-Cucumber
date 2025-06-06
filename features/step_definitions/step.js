import { expect } from "chai";
import { Builder, By, until } from "selenium-webdriver";
import { Given, When, Then, setDefaultTimeout, After } from "@cucumber/cucumber";

setDefaultTimeout(40000);
let driver;

After(async function () {
  if (driver) {
    await driver.quit();
    driver = null;
  }
});

// === GIVEN ===
Given("the user is on the login page", async function () {
  driver = new Builder().forBrowser("chrome").build();
  await driver.get("https://www.saucedemo.com/");
  await driver.wait(until.elementLocated(By.id("login-button")), 10000);
});

Given("the user is on the item page", async function () {
  await driver.findElement(By.id("user-name")).sendKeys("standard_user");
  await driver.findElement(By.id("password")).sendKeys("secret_sauce");
  await driver.findElement(By.id("login-button")).click();
  await driver.wait(until.elementLocated(By.className("inventory_item")), 8000);
});

// === WHEN ===
When("the user enters a valid username and password", async function () {
  await driver.findElement(By.id("user-name")).sendKeys("standard_user");
  await driver.findElement(By.id("password")).sendKeys("secret_sauce");
});

When("the user enters an invalid username and password", async function () {
  await driver.findElement(By.id("user-name")).sendKeys("invalid_user");
  await driver.findElement(By.id("password")).sendKeys("wrong_password");
});

When("the user clicks the login button", async function () {
  const loginButton = await driver.wait(until.elementLocated(By.id("login-button")), 8000);
  await loginButton.click();
});

When("the user add item to the cart", async function () {
  const addBtn = await driver.wait(
    until.elementLocated(By.id("add-to-cart-sauce-labs-backpack")),
    8000
  );
  await addBtn.click();
});

When("the user views the cart page", async function () {
  const cartIcon = await driver.wait(until.elementLocated(By.className("shopping_cart_link")), 8000);
  await cartIcon.click();
  await driver.wait(until.elementLocated(By.xpath("//span[text()='Your Cart']")), 8000);
});

When("the user remove item to the cart", async function () {
  // Pastikan sudah di halaman cart
  const cartIcon = await driver.findElement(By.className("shopping_cart_link"));
  await cartIcon.click();

  await driver.wait(until.elementLocated(By.className("cart_item")), 8000);

  const removeButton = await driver.findElement(By.css(".cart_item .cart_button"));
  await removeButton.click();
});


When("the user in the item list", async function () {
  await driver.wait(until.elementLocated(By.className("inventory_list")), 8000);
});

When("the user clicks the checkout button", async function () {
  const checkoutBtn = await driver.wait(until.elementLocated(By.id("checkout")), 8000);
  await checkoutBtn.click();
});

When("the user fills the checkout information", async function () {
  await driver.findElement(By.id("first-name")).sendKeys("John");
  await driver.findElement(By.id("last-name")).sendKeys("Doe");
  await driver.findElement(By.id("postal-code")).sendKeys("12345");
});

When("the user clicks continue and finish", async function () {
  const continueBtn = await driver.wait(until.elementLocated(By.id("continue")), 8000);
  await continueBtn.click();

  const finishBtn = await driver.wait(until.elementLocated(By.id("finish")), 8000);
  await finishBtn.click();
});

When("the user clicks the menu button", async function () {
  const menuButton = await driver.wait(until.elementLocated(By.id("react-burger-menu-btn")), 8000);
  await menuButton.click();
  await driver.sleep(2000); // untuk animasi
  await driver.wait(until.elementLocated(By.id("logout_sidebar_link")), 8000);
});

When("the user clicks the logout button", async function () {
  const logoutButton = await driver.wait(
    until.elementIsVisible(driver.findElement(By.id("logout_sidebar_link"))),
    8000
  );
  await logoutButton.click();
});

When("the user clicks on a product image", async function () {
  const img = await driver.wait(until.elementLocated(By.id("item_4_img_link")), 8000);
  await img.click();
});

// === THEN ===
Then("the user should see a success message", async function () {
  const message = await driver.wait(until.elementLocated(By.className("title")), 8000).getText();
  expect(message.trim()).to.equal("Products");
});

Then("the user should see a failed message", async function () {
  const errorMessage = await driver.wait(until.elementLocated(By.css("[data-test='error']")), 8000).getText();
  expect(errorMessage.toLowerCase()).to.include("username and password");
});


Then("item should be seen in the item page", async function () {
  // KLIK ikon cart dulu agar ke halaman cart
  const cartIcon = await driver.findElement(By.className("shopping_cart_link"));
  await cartIcon.click();

  // Tunggu elemen cart muncul
  const cartItem = await driver.wait(
    until.elementLocated(By.className("cart_item")),
    8000
  );
  expect(cartItem).to.exist;

  // Verifikasi nama item
  const itemName = await driver.findElement(By.className("inventory_item_name")).getText();
  expect(itemName).to.equal("Sauce Labs Backpack");

  // Lanjut ke halaman produk
  await driver.findElement(By.id("continue-shopping")).click();

  // Pastikan badge cart = 1
  const cartBadge = await driver.findElement(By.className("shopping_cart_badge")).getText();
  expect(cartBadge).to.equal("1");
});



Then("item shouldn't be seen in the item page", async function () {
  // Pastikan berada di halaman cart
  const cartIcon = await driver.findElement(By.className("shopping_cart_link"));
  await cartIcon.click();

  // Cari semua elemen dengan class "cart_item"
  const cartItems = await driver.findElements(By.className("cart_item"));

  // Jika item sudah dihapus, array-nya harus kosong
  expect(cartItems.length).to.equal(0);
});


Then("the user should be redirected to login page", async function () {
  await driver.wait(until.urlIs("https://www.saucedemo.com/"), 10000);
  const loginButton = await driver.wait(until.elementLocated(By.id("login-button")), 5000);
  expect(await loginButton.isDisplayed()).to.be.true;
});

Then("the user should see product details page", async function () {
  await driver.wait(until.elementLocated(By.className("inventory_details_name")), 8000);
  const backButton = await driver.findElement(By.id("back-to-products"));
  expect(backButton).to.exist;
});

Then("the product information should be displayed", async function () {
  const productName = await driver.findElement(By.className("inventory_details_name")).getText();
  expect(productName).to.not.be.empty;

  const productDesc = await driver.findElement(By.className("inventory_details_desc")).getText();
  expect(productDesc).to.not.be.empty;

  const productPrice = await driver.findElement(By.className("inventory_details_price")).getText();
  expect(productPrice).to.include("$");

  const productImage = await driver.findElement(By.className("inventory_details_img"));
  expect(productImage).to.exist;
});

Then("the user should see a confirmation message", async function () {
  const confirmationHeader = await driver.wait(until.elementLocated(By.className("complete-header")), 8000);
  const confirmationText = await confirmationHeader.getText();
  expect(confirmationText).to.equal("Thank you for your order!");
});
