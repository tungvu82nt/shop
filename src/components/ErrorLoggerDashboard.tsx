import React, { useState, useEffect } from 'react';
import { AlertTriangle, Download, Trash2, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { errorLogger, ErrorLog, ErrorStats } from '@/services/errorLogger';

interface ErrorLoggerDashboardProps {
  className?: string;
}

export const ErrorLoggerDashboard: React.FC<ErrorLoggerDashboardProps> = ({ className }) => {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [stats, setStats] = useState<ErrorStats | null>(null);
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null);
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLogs(errorLogger.getLogs());
    setStats(errorLogger.getStats());
  };

  const handleClearLogs = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả logs?')) {
      errorLogger.clearLogs();
      loadData();
    }
  };

  const handleExportLogs = () => {
    errorLogger.exportLogs();
  };

  const toggleDetails = (logId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }));
  };

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'destructive';
      case 'react': return 'destructive';
      case 'network': return 'secondary';
      case 'auth': return 'outline';
      case 'payment': return 'default';
      default: return 'secondary';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  if (!stats) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          Đang tải dữ liệu...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Error Logger Dashboard
              </CardTitle>
              <CardDescription>
                Theo dõi và quản lý các lỗi trong ứng dụng
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Làm mới
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportLogs}>
                <Download className="h-4 w-4 mr-2" />
                Xuất logs
              </Button>
              <Button variant="destructive" size="sm" onClick={handleClearLogs}>
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tất cả
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="logs">Chi tiết logs</TabsTrigger>
              <TabsTrigger value="stats">Thống kê</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{stats.totalErrors}</div>
                    <p className="text-xs text-muted-foreground">Tổng số lỗi</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{stats.errorsByType.error || 0}</div>
                    <p className="text-xs text-muted-foreground">Lỗi chung</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{stats.errorsByType.react || 0}</div>
                    <p className="text-xs text-muted-foreground">Lỗi React</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{stats.errorsByType.network || 0}</div>
                    <p className="text-xs text-muted-foreground">Lỗi mạng</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lỗi gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  {logs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <Badge variant={getErrorTypeColor(log.type) as any}>
                          {log.type}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{log.message}</p>
                          <p className="text-xs text-muted-foreground">{formatTimestamp(log.timestamp)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Không có lỗi nào được ghi lại
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="logs" className="space-y-4">
              <div className="space-y-2">
                {logs.map((log) => (
                  <Card key={log.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge variant={getErrorTypeColor(log.type) as any}>
                            {log.type}
                          </Badge>
                          <span className="font-medium">{log.message}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(log.timestamp)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDetails(log.id)}
                          >
                            {showDetails[log.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      {showDetails[log.id] && (
                        <div className="mt-3 space-y-2">
                          {log.context && (
                            <div>
                              <strong className="text-xs">Context:</strong>
                              <p className="text-xs text-muted-foreground">{log.context}</p>
                            </div>
                          )}
                          {log.stack && (
                            <div>
                              <strong className="text-xs">Stack Trace:</strong>
                              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                                {log.stack}
                              </pre>
                            </div>
                          )}
                          {log.componentStack && (
                            <div>
                              <strong className="text-xs">Component Stack:</strong>
                              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                                {log.componentStack}
                              </pre>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <strong>URL:</strong>
                              <p className="text-muted-foreground break-all">{log.url}</p>
                            </div>
                            <div>
                              <strong>User Agent:</strong>
                              <p className="text-muted-foreground break-all">{log.userAgent}</p>
                            </div>
                          </div>
                          {log.userId && (
                            <div>
                              <strong className="text-xs">User ID:</strong>
                              <p className="text-xs text-muted-foreground">{log.userId}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {logs.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Không có lỗi nào được ghi lại</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Phân loại lỗi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(stats.errorsByType).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center">
                          <Badge variant={getErrorTypeColor(type) as any}>{type}</Badge>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Thông tin hệ thống</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Tổng số lỗi:</strong> {stats.totalErrors}
                      </div>
                      <div>
                        <strong>Lỗi đầu tiên:</strong> {stats.firstError ? formatTimestamp(stats.firstError) : 'N/A'}
                      </div>
                      <div>
                        <strong>Lỗi gần nhất:</strong> {stats.lastError ? formatTimestamp(stats.lastError) : 'N/A'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorLoggerDashboard;