"""Production entrypoint — use Start Command: python start.py (no special characters)."""
import os
import sys
import traceback

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    print(f"--- Starting ResumeIQ Backend on port {port} ---", flush=True)
    try:
        # Pre-import app to catch any import-time or configuration exceptions
        import app.main
        print("--- app.main successfully loaded ---", flush=True)
        import uvicorn
        uvicorn.run("app.main:app", host="0.0.0.0", port=port, log_level="info")
    except Exception as exc:
        print(f"FATAL ERROR during startup: {exc}", file=sys.stderr, flush=True)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
