from apscheduler.schedulers.background import BackgroundScheduler
import logging

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()

def start():
    if not scheduler.running:
        scheduler.start()
        logger.info("APScheduler started with in-memory job store.")
    else:
        logger.info("APScheduler is already running.")

def shutdown():
    if scheduler.running:
        scheduler.shutdown()
        logger.info("APScheduler shut down.")
