# logging/log_manager.py
import logging
from typing import Dict, Any, Optional
from enum import Enum
from config import Settings

class LogLevel(Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"

class LogManager:
    """
    Centralized logging manager for the application.
    Implements singleton pattern to ensure only one instance exists.
    """
    _instance = None
    _loggers: Dict[str, logging.Logger] = {}
    
    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            settings = Settings()
            self._default_level = settings.LOG_LEVEL
            self._initialized = True
    
    def get_logger(self, logger_name: str = "content-bot") -> logging.Logger:
        """
        Get or create a logger with the specified name.
        
        Args:
            logger_name: Name for the logger
            
        Returns:
            Logger instance
        """
        if logger_name not in self._loggers:
            logger = logging.getLogger(logger_name)
            logger.setLevel(self._default_level)
            
            # Add handler if none exists
            if not logger.handlers:
                handler = logging.StreamHandler()
                formatter = logging.Formatter(
                    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
                )
                handler.setFormatter(formatter)
                logger.addHandler(handler)
            
            self._loggers[logger_name] = logger
            
        return self._loggers[logger_name]
    
    def log(self, 
            logger_name: str,
            level: LogLevel, 
            message: str, 
            context: Optional[Dict[str, Any]] = None,
            error: Optional[Exception] = None) -> None:
        """
        Log a message with the specified level and optional context/error.
        
        Args:
            logger_name: Name of the logger to use
            level: LogLevel enum indicating severity
            message: Main log message
            context: Optional dictionary of contextual information
            error: Optional exception object
        """
        logger = self.get_logger(logger_name)
        full_message = message
        
        if context:
            full_message += f" | Context: {context}"
        if error:
            full_message += f" | Error: {str(error)}"
            
        if level == LogLevel.DEBUG:
            logger.debug(full_message)
        elif level == LogLevel.INFO:
            logger.info(full_message)
        elif level == LogLevel.WARNING:
            logger.warning(full_message)
        elif level == LogLevel.ERROR:
            logger.error(full_message)
        elif level == LogLevel.CRITICAL:
            logger.critical(full_message)

    def debug(self, logger_name: str, message: str, context: Optional[Dict[str, Any]] = None) -> None:
        self.log(logger_name, LogLevel.DEBUG, message, context)

    def info(self, logger_name: str, message: str, context: Optional[Dict[str, Any]] = None) -> None:
        self.log(logger_name, LogLevel.INFO, message, context)

    def warning(self, logger_name: str, message: str, context: Optional[Dict[str, Any]] = None) -> None:
        self.log(logger_name, LogLevel.WARNING, message, context)

    def error(self, logger_name: str, message: str, context: Optional[Dict[str, Any]] = None, error: Optional[Exception] = None) -> None:
        self.log(logger_name, LogLevel.ERROR, message, context, error)

    def critical(self, logger_name: str, message: str, context: Optional[Dict[str, Any]] = None, error: Optional[Exception] = None) -> None:
        self.log(logger_name, LogLevel.CRITICAL, message, context, error)
