package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
)

// Define a struct to represent the data you want to return from the API
type Response struct {
	Message string `json:"message"`
}

func main() {
	// Register the handler function for the "/api" endpoint
	http.HandleFunc("/api", handleAPI)
	http.HandleFunc("/submit", submitHandler)
	http.HandleFunc("/get-all", handleReturnAllData)

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

// Handler function for the "/api" endpoint
func handleReturnAllData(w http.ResponseWriter, r *http.Request) {
	// Encode the response object to JSON
	sentimentType := strings.ToLower(r.URL.Query().Get("sentiment"))
	fmt.Println("sentimentType", sentimentType)

	newRequestData := []RequestData{}
	for _, data := range RequestDatas {
		if strings.ToLower(data.FeedbackResponse.Sentiment) == sentimentType {
			newRequestData = append(newRequestData, data)
		}
	}
	jsonResponse, err := json.Marshal(newRequestData)
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
type (
	RequestData struct {
		Name             string `json:"name"`
		Comment          string `json:"comment"`
		FeedbackResponse FeedbackResponse
	}
	FeedbackResponse struct {
		Sentiment         string   `json:"sentiment"`
		HelpfulSuggestion bool     `json:"helpful_suggestion"`
		Categories        []string `json:"categories"`
		Suggestion        string   `json:"suggestion"`
	}
)

var (
	RequestDatas []RequestData
	//mu        sync.Mutex
)

// Handler function for the /submit endpoint
func submitHandler(w http.ResponseWriter, r *http.Request) {
	// Decode the JSON request body into a RequestData struct
	var requestData RequestData
	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		http.Error(w, "Error decoding requestData JSON", http.StatusBadRequest)
		return
	}

	// Send the response to OpenAI API and get a response
	openAIResponse, err := sendToOpenAiMsg(requestData.Comment)
	//fmt.Println("openAIResponse", openAIResponse, err)
	msg := ""
	if len(openAIResponse.Choices) > 0 {
		msg = openAIResponse.Choices[0].Message.Content
	}
	fmt.Println("openAIResponse msg", msg, err)
	if err != nil {
		http.Error(w, "Error sending data to OpenAI", http.StatusInternalServerError)
		return
	}

	newFeedbackResponse := FeedbackResponse{}
	if msg != "" {
		err := json.NewDecoder(strings.NewReader(msg)).Decode(&newFeedbackResponse)
		if err != nil {
			http.Error(w, "Error decoding msg JSON", http.StatusBadRequest)
			return
		}
	}

	requestData.FeedbackResponse = newFeedbackResponse

	// Append the response to the responses array
	RequestDatas = append(RequestDatas, requestData)

	// Encode the response object to JSON
	jsonResponse, err := json.Marshal(requestData)
	if err != nil {
		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
		return
	}

	// Set the Content-Type header to application/json
	w.Header().Set("Content-Type", "application/json")

	// Write the JSON response to the client
	w.Write(jsonResponse)
}

type (
	OpenAiChatCompletions struct {
		ID      string `json:"id"`
		Object  string `json:"object"`
		Created int    `json:"created"`
		Model   string `json:"model"`
		Choices []struct {
			Index   int `json:"index"`
			Message struct {
				Role    string `json:"role"`
				Content string `json:"content"`
			} `json:"message"`
			Logprobs     interface{} `json:"logprobs"`
			FinishReason string      `json:"finish_reason"`
		} `json:"choices"`
		Usage struct {
			PromptTokens     int `json:"prompt_tokens"`
			CompletionTokens int `json:"completion_tokens"`
			TotalTokens      int `json:"total_tokens"`
		} `json:"usage"`
		SystemFingerprint string `json:"system_fingerprint"`
	}

	OpenAiSendMsg struct {
		Model    string    `json:"model"`
		Messages []Message `json:"messages"`
		Stream   bool      `json:"stream"`
	}
	Message struct {
		Role    string `json:"role"`
		Content string `json:"content"`
	}
)

// Function to send data to OpenAI API
func sendToOpenAiMsg(data string) (OpenAiChatCompletions, error) {
	// Define the request payload
	payload := OpenAiSendMsg{
		Model: "gpt-3.5-turbo",
		Messages: []Message{
			{
				Role:    "user",
				Content: `You are a sentiment analysis tool use to evaluate feedback on Web applications and tasked to perform 3 metrics assessment.  1. Analyse if the incoming statement contains a helpful suggestion and return a boolean value 2. Analyse the key words and categories the helpful suggestion is referring to and return all related categories in an array of string. Key words and categories to look out for would be those related to typical web application features 3. Identify the overall sentiment of the statement and return if the statement is positive or negative 4. Compile the categories this relate to and provide a suggestion to developer of the web application on things they can improve with the tone of an over pragmatic geek. This suggestion is meant to be read by developers of the web application and make them feel good about themselves. The expected response should be in JSON format and the following is an example: {"sentiment": "positive", "helpful_suggestion": "true", "categories": ["login", "feedback"], "suggestion":"your application is the best and I like to see more product listings!`,
			},
			{
				Role:    "user",
				Content: data,
			},
		},
		Stream: false,
	}
	resp, err := openAiApi(payload, "v1/chat/completions")

	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	//fmt.Println("body", string(body))
	if err != nil {
		return OpenAiChatCompletions{}, err
	}

	// Parse the JSON response
	var openAIResponse OpenAiChatCompletions
	err = json.Unmarshal(body, &openAIResponse)
	if err != nil {
		return OpenAiChatCompletions{}, err
	}

	return openAIResponse, nil
}

func openAiApi(payload OpenAiSendMsg, urlParams string) (*http.Response, error) {
	// Define your OpenAI API key
	apiKey := ""
	// TODO INSERT THE API KEY

	// Convert payload to JSON
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return &http.Response{}, err
	}

	// Create HTTP request to OpenAI API
	req, err := http.NewRequest("POST", "https://api.openai.com/"+urlParams, bytes.NewReader(payloadBytes))
	if err != nil {
		return &http.Response{}, err
	}

	// Set the Authorization header with your API key
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	// Send the HTTP request
	client := http.Client{}
	return client.Do(req)

}
