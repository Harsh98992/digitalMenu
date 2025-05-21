import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class RestaurantService {
    apiUrl = environment.apiUrl;
    cartItem = new BehaviorSubject([]);
    cartState = new BehaviorSubject({});
    amountToBePaidSubject = new BehaviorSubject(null);
    bypassGaurd = false;
    constructor(private http: HttpClient) {}
    getRestaurantData(url: string) {
        return this.http.get(
            `${this.apiUrl}/v1/restaurant/getRestaurant?restaurant=${url}`
        );
    }
    getCartItem() {
        return this.cartItem.asObservable();
    }
    setCartItem(data: any) {
        localStorage.setItem("cartItem", JSON.stringify(data));
        this.cartItem.next(data);
    }
    setRestaurantUrl(url) {
        localStorage.setItem("activeRestaurantUrl", url);
    }
    getRestaurantUrl() {
        return localStorage.getItem("activeRestaurantUrl");
    }
    getAllRoomsRestaurant(reqBody) {
        return this.http.post(
            `${this.apiUrl}/v1/customer/getAllRoomRestaurant`,
            reqBody
        );
    }
    getOrderwithOrderId(orderId) {
        return this.http.get(
            `${this.apiUrl}/v1/orders/getOrderwithOrderId/${orderId}`
        );
    }
    getRestaurantWithRoomService() {
        return this.http.get(
            `${this.apiUrl}/v1/orders/getRestaurantWithRoomService`
        );
    }
    getOrderwithRestaurantNameCustomerNameRoomName(reqData) {
        return this.http.post(
            `${this.apiUrl}/v1/orders/getOrderwithRestaurantNameCustomerNameRoomName`,
            reqData
        );
    }
    getRestaurantById(restaurantId) {
        return this.http.get(
            `${this.apiUrl}/v1/restaurant/getRestaurantById/${restaurantId}`
        );
    }
    getCartSessionData() {
        const data = localStorage.getItem("cartItem");
        if (data) {
            return JSON.parse(data);
        }
    }
    getCartState() {
        return this.cartState.asObservable();
    }
    getCartStateSessionData() {
        const data = localStorage.getItem("cartState");
        if (data) {
            return JSON.parse(data);
        }
    }

    setCartSate(data: any) {
        localStorage.setItem("cartState", JSON.stringify(data));
        this.cartState.next(data);
    }
    getRestaurantReview(placeId) {
        return this.http.get(`${this.apiUrl}/v1/restaurant/reviews/${placeId}`);
    }
    validationBeforeOrder(data) {
        return this.http.post(
            `${this.apiUrl}/v1/orders/validationBeforeOrder`,
            data
        );
    }
    placeOrder(data) {
        return this.http.post(`${this.apiUrl}/v1/payment/getCheckSum`, data);
    }
    razorPay(data: any) {
        return this.http.post(`${this.apiUrl}/v1/payment/razorpay`, data);
    }

    submitFeedback(data: any) {
        return this.http.post(`${this.apiUrl}/v1/feedback`, data);
    }

    getFeedbackByRestaurant(restaurantId: string) {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        return this.http.get(
            `${this.apiUrl}/v1/feedback/restaurant/${restaurantId}?_=${timestamp}`
        );
    }

    getFeedbackStats(restaurantId: string) {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        return this.http.get(
            `${this.apiUrl}/v1/feedback/stats/${restaurantId}?_=${timestamp}`
        );
    }

    searchRestaurants(query: string) {
        return this.http.get(
            `${this.apiUrl}/v1/restaurant/search?query=${encodeURIComponent(
                query
            )}`
        );
    }

    checkFeedbackCollection() {
        return this.http.get(`${this.apiUrl}/v1/feedback/check-collection`);
    }

    getAllRestaurants() {
        return this.http.get(`${this.apiUrl}/v1/restaurant/all`);
    }
    storeRestaurnat(data) {
        return this.http.post(
            `${this.apiUrl}/v1/customer/storeRestaurant`,
            data
        );
    }
    getPastRestaurantData(reqData) {
        return this.http.post(
            `${this.apiUrl}/v1/customer/getCustomerPreviousRestaurant`,
            reqData
        );
    }
    checkDineInTableAvailability(data) {
        return this.http.patch(
            `${this.apiUrl}/v1/restaurant/checkDineInTableAvailability`,
            data
        );
    }
    checkActiveDineIn(restaurantId) {
        return this.http.get(
            `${this.apiUrl}/v1/restaurant/checkAciveDineIn/${restaurantId}`
        );
    }

    // Call waiter API
    callWaiter(data) {
        return this.http.post(`${this.apiUrl}/v1/waiter/callWaiter`, data);
    }

    // Room-Customer Link validation
    validateRoomCustomerLink(phoneNumber: string, roomName: string) {
        console.log(`[DEBUG] Making API call to validate room-customer link:`, {
            phoneNumber,
            roomName,
        });
        console.log(`[DEBUG] API base URL: ${this.apiUrl}`);
        console.log(
            `[DEBUG] Environment: ${
                environment.production ? "Production" : "Development"
            }`
        );

        // Check if API URL is correctly configured
        if (!this.apiUrl) {
            console.error(
                `[DEBUG] API URL is not configured properly: ${this.apiUrl}`
            );
            throw new Error("API URL is not configured properly");
        }

        // Construct the full API URL with phone number and room name
        const encodedPhone = encodeURIComponent(phoneNumber);
        const encodedRoom = encodeURIComponent(roomName);
        const apiUrl = `${this.apiUrl}/v1/room-customer-link/validate?phoneNumber=${encodedPhone}&roomName=${encodedRoom}`;
        console.log(
            `[DEBUG] Using phone+room parameters: ${encodedPhone}, ${encodedRoom}`
        );

        console.log(`[DEBUG] Full API URL: ${apiUrl}`);

        // First, try to ping the health endpoint to check server connectivity
        console.log(
            `[DEBUG] Testing API server connectivity via health endpoint...`
        );
        fetch(`${this.apiUrl}${environment.healthEndpoint}`)
            .then((response) => {
                console.log(`[DEBUG] Health endpoint response:`, response);
                if (response.ok) {
                    console.log(
                        `[DEBUG] Health endpoint is reachable, server is running`
                    );
                } else {
                    console.error(
                        `[DEBUG] Health endpoint returned status: ${response.status}`
                    );
                }
            })
            .catch((error) => {
                console.error(`[DEBUG] Health endpoint error:`, error);
                console.error(
                    `[DEBUG] This indicates a potential network or CORS issue`
                );
            });

        // Add comprehensive headers and error handling
        return this.http
            .get(apiUrl, {
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                observe: "response", // Get the full HTTP response
                responseType: "json",
                withCredentials: false, // Don't send cookies for cross-domain requests
            })
            .pipe(
                map((response: any) => {
                    console.log(`[DEBUG] Full API response:`, response);
                    console.log(`[DEBUG] Response status: ${response.status}`);
                    console.log(`[DEBUG] Response headers:`, response.headers);
                    console.log(`[DEBUG] Response body:`, response.body);

                    // Return just the body for backward compatibility
                    return response.body;
                }),
                catchError((error: any) => {
                    console.error(`[DEBUG] API error:`, error);
                    console.error(`[DEBUG] Error status: ${error.status}`);
                    console.error(`[DEBUG] Error message: ${error.message}`);
                    console.error(`[DEBUG] Error details:`, error.error);

                    // Add more detailed error information
                    let errorInfo = {
                        status: error.status,
                        message: error.message,
                        url: apiUrl,
                        details: error.error,
                        type: "unknown",
                    };

                    // Categorize the error
                    if (error.status === 0) {
                        errorInfo.type = "network";
                        errorInfo.message =
                            "Cannot connect to the server. This could be due to:";
                        errorInfo.details = [
                            "The server is not running or is unreachable",
                            "CORS policy is blocking the request",
                            "Network connectivity issues",
                            "Firewall or proxy settings blocking the request",
                        ];

                        // Check if we're in development mode with localhost
                        if (this.apiUrl.includes("localhost")) {
                            errorInfo.details.push(
                                "You are using a localhost API URL. Make sure the backend server is running locally."
                            );

                            // Try to diagnose the issue further
                            this.testDirectConnection(apiUrl);
                        }
                    } else if (error.status === 404) {
                        errorInfo.type = "not_found";
                        errorInfo.message =
                            "The API endpoint was not found on the server.";
                    } else if (error.status === 403 || error.status === 401) {
                        errorInfo.type = "auth";
                        errorInfo.message =
                            "Authentication or authorization error.";
                    } else if (error.status >= 500) {
                        errorInfo.type = "server";
                        errorInfo.message = "Server error occurred.";
                    }

                    console.error(`[DEBUG] Categorized error:`, errorInfo);

                    // Enhance the error object with our additional information
                    error.errorInfo = errorInfo;

                    // Rethrow the enhanced error to be handled by the component
                    throw error;
                })
            );
    }

    // Test direct connection to the API endpoint
    private testDirectConnection(url: string) {
        console.log(`[DEBUG] Testing direct connection to: ${url}`);

        // Try with fetch API
        fetch(url, {
            method: "GET",
            mode: "no-cors", // Important: This allows the request to succeed even if CORS is not configured
            cache: "no-cache",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                console.log(`[DEBUG] Direct fetch response:`, response);
                console.log(`[DEBUG] Response type:`, response.type);
                // Note: With mode: 'no-cors', we can't access the response content
                // but we can at least confirm the server is reachable
                if (response.type === "opaque") {
                    console.log(
                        `[DEBUG] Server is reachable, but CORS is likely blocking the response`
                    );
                    console.log(
                        `[DEBUG] This is expected with mode: 'no-cors'`
                    );
                    console.log(
                        `[DEBUG] Try accessing the API directly in the browser: ${url}`
                    );
                }
            })
            .catch((error) => {
                console.error(`[DEBUG] Direct fetch error:`, error);
                console.error(
                    `[DEBUG] This indicates the server is not reachable at all`
                );
            });

        // Also try with XMLHttpRequest for comparison
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                console.log(`[DEBUG] XHR status:`, xhr.status);
                console.log(`[DEBUG] XHR response:`, xhr.responseText);
            }
        };
        xhr.onerror = (error) => {
            console.error(`[DEBUG] XHR error:`, error);
        };
        xhr.open("GET", url);
        xhr.send();
    }
}
