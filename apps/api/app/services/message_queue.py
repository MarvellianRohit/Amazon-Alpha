from typing import Callable, Dict, List
import asyncio

class MessageQueueService:
    """
    Simulates Azure Service Bus / RabbitMQ.
    Facilitates Asynchronous, Atomic Handoffs.
    """
    def __init__(self):
        self.queues: Dict[str, List[Dict]] = {}
        self.subscribers: Dict[str, Callable] = {}

    async def publish(self, topic: str, message: Dict):
        """
        Publishes a message to a topic.
        Persists message (Durable) and notifies subscribers.
        """
        if topic not in self.queues:
            self.queues[topic] = []
        
        # Enqueue (Simulate Broker Persistence)
        msg_wrapper = {"id": "msg-" + str(len(self.queues[topic])), "body": message, "status": "PENDING"}
        self.queues[topic].append(msg_wrapper)
        print(f"[MQ] Published to '{topic}': {message.get('step', 'unknown')}")
        
        # Async Push (Simulate Worker Trigger)
        if topic in self.subscribers:
            await self.subscribers[topic](message)

    def subscribe(self, topic: str, handler: Callable):
        """
        Registers a worker/agent to listen to a topic.
        """
        self.subscribers[topic] = handler
        print(f"[MQ] Subscribed to '{topic}'")

mq_service = MessageQueueService()
