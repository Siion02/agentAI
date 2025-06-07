# Example: Simple sport and geography tools

def sport_tool(query: dict) -> str:
    # Expected input: {"sport": "soccer", "question": "..."}
    sport = query.get("sport", "unknown sport")
    question = query.get("question", "")
    # Here you could add real logic, like calling an external API or database
    return f"Sport-related answer about {sport}: {question}"

def geography_tool(query: dict) -> str:
    location = query.get("location", "unknown location")
    fact = query.get("fact", "")
    # Simulated geographic information
    return f"Geographic info about {location}: {fact}"

# Dispatcher to call tools by name
TOOLS_IMPL = {
    "sport_tool": sport_tool,
    "geography_tool": geography_tool,
}

def call_tool(tool_name: str, arguments: dict) -> str:
    if not isinstance(arguments, dict):
        return f"Invalid arguments for {tool_name}: expected a dictionary."

    tool_fn = TOOLS_IMPL.get(tool_name)
    if not tool_fn:
        return f"Tool {tool_name} not found."

    return tool_fn(arguments)

# Optional: function to list available tools
def list_available_tools():
    return list(TOOLS_IMPL.keys())
