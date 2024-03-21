package main

import (
	"encoding/json"
	"log"
	"net/http"
)

// Define a struct to represent the data you want to return from the API
type Response struct {
	Message string `json:"message"`
}

func main() {
	// Register the handler function for the "/api" endpoint
	http.HandleFunc("/api", handleAPI)
	http.HandleFunc("/submit", submitHandler)

	// Start the server on port 8080
	log.Println("Server listening on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// Handler function for the "/api" endpoint
func handleAPI(w http.ResponseWriter, r *http.Request) {
	// Create a response object
	response := Response{
		Message: "Hello, world!",
	}

	// Encode the response object to JSON
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
		return
	}

	// Set the Content-Type header to application/json
	w.Header().Set("Content-Type", "application/json")

	// Write the JSON response to the client
	w.Write(jsonResponse)
}
// Define a struct to represent the data received from the client
type RequestData struct {
	Name string `json:"name"`
	Comment string `json:"comment"`
}
// Handler function for the /submit endpoint
func submitHandler(w http.ResponseWriter, r *http.Request) {
	// Decode the JSON request body into a RequestData struct
	var requestData RequestData
	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	// Create a response object
	response := Response{
		Message: "Data received successfully!",
	}

	// Send the response to OpenAI API and get a response
	openAIResponse, err := sendToOpenAI(response.Message)
	if err != nil {
		http.Error(w, "Error sending data to OpenAI", http.StatusInternalServerError)
		return
	}
	
	// Lock access to the responses array
	mu.Lock()
	defer mu.Unlock()

	// Append the response to the responses array
	responses = append(responses, response)

	// Encode the response object to JSON
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
		return
	}

	// Set the Content-Type header to application/json
	w.Header().Set("Content-Type", "application/json")

	// Write the JSON response to the client
	w.Write(jsonResponse)
}
var (
	responses []Response
	mu        sync.Mutex
)
// Function to send data to OpenAI API
func sendToOpenAI(data string) (Response, error) {
	// Define your OpenAI API key
	apiKey := "your-openai-api-key"
// TODO INSERT THE API KEY BRUH

	// Define the request payload
	payload := map[string]string{
		"text": data,
	}

	// Convert payload to JSON
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return Response{}, err
	}

	// Create HTTP request to OpenAI API
	req, err := http.NewRequest("POST", "https://api.openai.com/v1/your-endpoint", bytes.NewReader(payloadBytes))
	if err != nil {
		return Response{}, err
	}

	// Set the Authorization header with your API key
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	// Send the HTTP request
	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return Response{}, err
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return Response{}, err
	}

	// Parse the JSON response
	var openAIResponse Response
	err = json.Unmarshal(body, &openAIResponse)
	if err != nil {
		return Response{}, err
	}

	return openAIResponse, nil
}