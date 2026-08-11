import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  declare props: Props;

  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h1 className="text-xl font-bold text-red-400 mb-2">⚠️ Error al cargar la aplicación</h1>
            <p className="text-sm text-neutral-300 mb-4">
              Ha ocurrido un problema al iniciar la Pokédex.
            </p>
            <div className="bg-black/60 p-3 rounded-lg text-left text-xs font-mono text-red-300 mb-4 overflow-x-auto border border-red-900/40">
              {this.state.error?.message || 'Error de JavaScript inesperado'}
            </div>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                } catch {
                  // ignore
                }
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-600/30"
            >
              Reiniciar Datos y Recargar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
