Feature: SauceDemo Login and Cart Management

    Scenario: Failed login with invalid credential
        Given the user is on the login page
        When the user enters an invalid username and password
        And the user clicks the login button
        Then the user should see a failed message


    Scenario: Successfully adding an item to cart
        Given the user is on the login page
        And the user is on the item page
        And the user add item to the cart
        And the user in the item list
        Then item should be seen in the item page


    Scenario: Successfully removing an item from cart
        Given the user is on the login page
        And the user is on the item page
        When the user add item to the cart
        And the user in the item list
        When the user remove item to the cart
        Then item shouldn't be seen in the item page

    Scenario: Checkout process successfully
        Given the user is on the login page
        When the user enters a valid username and password
        And the user clicks the login button
        And the user add item to the cart
        And the user views the cart page
        And the user clicks the checkout button
        And the user fills the checkout information
        And the user clicks continue and finish
        Then the user should see a confirmation message

    Scenario: Logout from the app
        Given the user is on the login page
        When the user enters a valid username and password
        And the user clicks the login button
        And the user clicks the menu button
        And the user clicks the logout button
        Then the user should be redirected to login page
