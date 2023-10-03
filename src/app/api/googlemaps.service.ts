import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, map, of } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class GoogleMapsService {
    apiUrl = environment.apiUrl;

    constructor(private httpClient: HttpClient) {}

    // Function to call the Autocomplete API and get search suggestions
    getAutocompleteResults(query: string) {
        if (query) {
            const autocompleteUrl = `${this.apiUrl}/v1/google-maps/autocomplete?input=${query}`;
            return this.httpClient.get<any>(autocompleteUrl).pipe(
                map((response) => response.predictions),
                catchError(() => of([]))
            );
        } else {
            return of([]);
        }
    }

    getGeocodeDetails(latitude: number, longitude: number) {
        // const apiKey = "AIzaSyA565Z7yEHcoZ1TMV4Asu3TZQGn0W2Np_A";

        let url = `${this.apiUrl}/v1/google-maps//geocode-details?latitude=${latitude}&longitude=${longitude}`;

        return this.httpClient.get<any>(url).pipe(
            map((response) => {
                console.log("Geocoding API response:", response);
                // return whole response will be used in the component and other functions to get the pin code
                return response;
            }),
            catchError((error) => {
                console.error("Geocoding API error:", error);
                return of("");
            })
        );
    }

    getFormattedGeocodeDetails(latitude: number, longitude: number) {
        // const apiKey = "AIzaSyA565Z7yEHcoZ1TMV4Asu3TZQGn0W2Np_A";

        let url = `${this.apiUrl}/v1/google-maps//geocode-details?latitude=${latitude}&longitude=${longitude}`;

        return this.httpClient.get<any>(url).pipe(
            map((response) => {
                console.log("Geocoding API response:", response);
                // return whole response will be used in the component and other functions to get the pin code
                const addressComponents =
                    response.results[0].address_components;

                const postalCodeComponent = addressComponents.find(
                    (component) => component.types.includes("postal_code")
                );

                return {
                    pinCode: postalCodeComponent
                        ? postalCodeComponent.long_name
                        : "",
                    completeAddress: response.results[0].formatted_address,

                    // Optional - You can return more details if you want
                    // city: addressComponents.find((component) =>
                    city: addressComponents.find((component) =>
                        component.types.includes("locality")
                    )
                        ? addressComponents.find((component) =>
                              component.types.includes("locality")
                          ).long_name
                        : "",
                    state: addressComponents.find((component) =>
                        component.types.includes("administrative_area_level_1")
                    )
                        ? addressComponents.find((component) =>
                              component.types.includes(
                                  "administrative_area_level_1"
                              )
                          ).long_name
                        : "",
                    country: addressComponents.find((component) =>
                        component.types.includes("country")
                    )
                        ? addressComponents.find((component) =>
                              component.types.includes("country")
                          ).long_name
                        : "",
                };
            }),
            catchError((error) => {
                console.error("Geocoding API error:", error);
                return of("");
            })
        );
    }

    // Function to get the pin code using Geocoding API
    getPinCodeFromGeocode(
        latitude: number,
        longitude: number
    ): Observable<string> {
        return this.getGeocodeDetails(latitude, longitude).pipe(
            map((response) => {
                console.log("Geocoding API response:", response);

                if (
                    response &&
                    response.results &&
                    response.results.length > 0
                ) {
                    const addressComponents =
                        response.results[0].address_components;
                    const postalCodeComponent = addressComponents.find(
                        (component) =>
                            component.types.includes("postal_code") ||
                            component.types.includes("postal_code_prefix") // Optional - Use this if you want more specific postal codes
                    );
                    return postalCodeComponent
                        ? postalCodeComponent.long_name
                        : "";
                } else {
                    return "";
                }
            }),
            catchError((error) => {
                console.error("Geocoding API error:", error);
                return of("");
            })
        );
    }

    getPlaceDetails(placeId: string) {
        const placeDetailsUrl = `${this.apiUrl}/v1/google-maps/place-details?placeId=${placeId}`;
        return this.httpClient.get<any>(placeDetailsUrl).pipe(
            map((response) => response.result),
            catchError(() => of([]))
        );
    }
}
