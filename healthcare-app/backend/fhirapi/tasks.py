from celery import shared_task

@shared_task
def test_task():
    print("✅ Test Celery Task Running")
    return "Success"
