# faq

this file contains faq for the project

## 1.16. FAQ

### 1.16.1. Common Questions by Non-Technical Staff

Q: How do I update menu items?
A: Use the admin dashboard menu management section. Navigate to Menu > Items and click "Edit" on the item you want to modify.

Q: How do I process orders?
A: Monitor the order management dashboard and update order statuses as follows:

   1. New orders appear in "Pending"
   2. Click "Accept" to move to "In Progress"
   3. Click "Complete" when ready for service

Q: How do I handle special dietary requests?
A: Add notes to menu items using the "Special Instructions" field in the item editor.

Q: How do I generate sales reports?
A: Navigate to Reports > Sales and select your desired date range.

### 1.16.2. Questions Related to API Usage

Q: How do I test API endpoints?
A: Use Postman or the Firebase Emulator Suite. API documentation is available at `/api/docs`.

Q: How do I handle API errors?
A: Check error codes and implement proper error handling. Common error codes:

- 401: Authentication required
- 403: Insufficient permissions
- 404: Resource not found
- 500: Server error

Q: How do I authenticate API requests?
A: Include the JWT token in the Authorization header: `Bearer <token>`.

### 1.16.3. Testing and Debugging FAQs

Q: How do I run tests?
A: Use `ng test` for unit tests and `ng e2e` for end-to-end testing.

Q: How do I debug issues?
A: Use browser DevTools and Firebase Console. Common debugging steps:

   1. Check browser console for errors
   2. Verify network requests
   3. Review Firebase logs
   4. Check application state

Q: How do I report bugs?
A: Submit issues on the project's GitHub repository with:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable

### 1.16.4. Deployment and Updates

Q: How do I deploy updates?
A: Run `npm run deploy` after merging changes to main branch.

Q: How do I rollback changes?
A: Use Firebase Console to revert to previous deployment.
