"""
应用配置文件
使用 Pydantic Settings 管理环境变量
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """应用配置"""

    # 数据库配置
    database_url: str = "postgresql://prism:prism_dev_password@localhost:5432/prism"

    # Redis 配置
    redis_url: str = "redis://localhost:6379/0"

    # OpenAI API 配置
    openai_api_key: str
    openai_model: str = "gpt-4o"

    # SeeDream API 配置
    seedream_api_key: str
    seedream_api_url: str = "https://api.seedream.com/v1"

    # 服务配置
    app_env: str = "development"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000

    # 图片存储
    storage_path: str = "../storage/images"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )


# 全局配置实例
settings = Settings()
