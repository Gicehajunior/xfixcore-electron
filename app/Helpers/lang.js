module.exports = {
    button_click_innerhtml_context: "Please Wait...",
    app_name: "XFIX Core",
    login_button_innerhtml_context:  "Sign In",
    register_button_innerhtml_context:  "Sign Up",
    forgot_password_button_innerhtml_context:  "Request Security Code",
    reset_password_button_innerhtml_context:  "Reset Password",
    login_notification: `Login Required. Please use your current username and Password to login and access the system!`,
    reset_password_notification: `Please check on your email if you received a security code.\n\n If you filled in the correct email, it must have been sent successfully. If not, Please consult System Administrator for help!`,
    input_security_code_notification: `Please fill in your email to receive a security code!`,
    fill_in_all_fields: `Please fill in all fields to login!`,
    notification_title: {
        login_notification_title: "Login Notification",
        reset_password_notification_title: "Reset Password Notification",
        input_security_code_notification_title: "Input Security Code Notification",
        forgot_password_notification_title: "Forgot Password Notification",
        dashboard_welcome_notification_title: "Welcome Message Notification"
    },
    errors: {
        empty_credentials: `Empty auth credentials`,
        fill_in_all_fields: `Please fill in all fields to login!`,
        empty_email: `Empty email`,
        invalid_email: `Email is invalid. Please correct your email to proceed!`,
        invalid_contact: `Contact is invalid. Please correct your contact to proceed!`,
        invalid_password: `Password too short or too long. Please fill in a strong password!`,
        incorrect_password: `Wrong Password. Fill in correct password to proceed!`,
        password_mismatch: `Password mismatch. Please confirm your password!`,
        wrong_user_credentials: `Wrong auth credentials`,
        user_not_exists: `No user found with the input Email. Please register to proceed!`,
        unexpected_error: `Please try again or consult System Administrator for help!`,
        wrong_security_code: `You entered Incorrect Security Passcode. Please check the latest passcode or close and reopen the application and try resetting your password again!`,
        create_account: 'Registration failed!',
        reset_password: `Password Reset failed!`,
        auth_error: `Authentication error. Please restart your application and try again!`
    },
    title: {
        login: `Login | XFIX Core Framework`,
        register: `Register | XFIX Core Framework`,
        forgotpassword: `Forgot Password | XFIX Core Framework`,
        resetpassword: `Reset Password | XFIX Core Framework`,
        dashboard: `Dashboard | XFIX Core Framework`,
    },
    user_exists: `Seems you're already registered!`,
    success: {
        login_success: `Login Successfull, Navigating to Dashboard. Please wait...`,
        create_account: "Registration Success",
        reset_password: `Password Reset successfully!`
    },
    footer_rights_tag_line: `&copy;${new Date().getFullYear()} All rights reserved.`,
    footer_app_name: "Electron <strong style='color: green'>XFIX Core.</strong>",
    current_year: new Date().getFullYear(),
    current_month: new Date().getMonth(),
    current_day: new Date().getDay(),
}



