export const getVerificationEmailTemplate = (registration) => {
    const eventsList = registration.selectedEvents.join(', ');
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background-color: #000;
                    color: gold;
                    padding: 20px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    font-size: 0.8em;
                    color: #666;
                }
                .details {
                    background-color: #fff;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Registration Verified</h1>
                </div>
                <div class="content">
                    <p>Dear ${registration.name},</p>
                    <p>Your registration has been successfully verified for the following events:</p>
                    <div class="details">
                        <p><strong>Events:</strong> ${eventsList}</p>
                        <p><strong>Registration ID:</strong> ${registration._id}</p>
                        <p><strong>Transaction ID:</strong> ${registration.transactionId}</p>
                    </div>
                    <p>You can now proceed with participating in the events. Please keep this email for your records.</p>
                    <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
                </div>
                <div class="footer">
                    <p>This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}; 