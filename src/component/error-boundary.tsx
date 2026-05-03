import { Component, ReactNode } from "react";
import { HorseIcon, ArrowClockwiseIcon } from "@/component";
import { useNavigate } from "react-router-dom";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export const FallbackErrorPage = () => {
  const navigate = useNavigate();

  const handleRefresh = () => window.location.reload();

  const handleGoHome = () => navigate("/", { replace: true });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-900">
      <div className="w-full max-w-md rounded-2xl shadow-md p-6 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-800">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            页面运行异常
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            页面运行异常，可能由state更新错误或依赖state的函数（如useActionState）未正确处理错误导致。
            请检查所有分支是否正确更新state，并确保依赖state的函数已添加错误处理。
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleGoHome}
              className="px-5 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 "
            >
              <HorseIcon size={16} /> 返回首页
            </button>
            <button
              onClick={handleRefresh}
              className="px-5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 "
            >
              <ArrowClockwiseIcon size={16} /> 刷新页面
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  resetErrorState = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return <FallbackErrorPage />;
    }
    return this.props.children;
  }
}
