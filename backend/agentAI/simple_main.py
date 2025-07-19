# Simple main to just make a request to the LLM model without any tools, only a base prompt.

from model_usage.model_router import ModelRouter

def main():
    router = ModelRouter()
    user_prompt = "What is the capital of Spain?"
    preferred_model = "llama3"

    client, model_id, base_prompt = router.get_client(preferred_model)

    messages = [
        {"role": "system", "content": base_prompt},
        {"role": "user", "content": user_prompt}
    ]

    print("Calling LLM ...")
    response = router.route(user_prompt, preferred_model=preferred_model, messages=messages)

    message = response.choices[0].message
    print("LLM response:")
    print(message.content)

if __name__ == "__main__":
    main()
