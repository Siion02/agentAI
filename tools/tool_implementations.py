def sport_tool(query: dict) -> str:

    sport = query.get("sport", "unknown sport")
    question = query.get("question", "")

    return f"Sport-related answer about {sport}: {question}"

def geography_tool(query: dict) -> str:
    location = query.get("location", "unknown location")
    fact = query.get("fact", "")

    return f"Geographic info about {location}: {fact}"

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

def list_available_tools():
    return list(TOOLS_IMPL.keys())
