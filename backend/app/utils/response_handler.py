from typing import Any


def success_response(message: str, data: Any = None) -> dict[str, Any]:
    return {"success": True, "message": message, "data": data if data is not None else {}}


def error_response(message: str, data: Any = None) -> dict[str, Any]:
    return {"success": False, "message": message, "data": data}
