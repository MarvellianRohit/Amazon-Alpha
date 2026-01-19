from typing import List, Optional
from pydantic import BaseModel
import random
from uuid import uuid4

class SocialPost(BaseModel):
    id: str
    creator_name: str
    creator_avatar: str
    video_url: str
    caption: str
    product_id: str
    product_title: str
    product_price: float
    trust_score: float
    likes: int

class SocialService:
    async def get_feed(self, user_id: str, limit: int = 10) -> List[SocialPost]:
        """
        Returns a ranked feed of videos.
        Ranking Algorithm:
        1. Trust Score (High weight)
        2. User Affinity (Mocked via random for now)
        """
        # Mock Data Generation simulating DB fetch + Ranking
        
        # In real app:
        # query = "SELECT * FROM social_posts p JOIN creator_stats s ON p.creator_id = s.creator_id ORDER BY s.trust_score DESC"
        
        mock_creators = [
            {"name": "TechReviewer_Pro", "avatar": "https://i.pravatar.cc/150?u=tech", "trust": 95.0},
            {"name": "GadgetGirl", "avatar": "https://i.pravatar.cc/150?u=gadget", "trust": 88.5},
            {"name": "BudgetBuys", "avatar": "https://i.pravatar.cc/150?u=budget", "trust": 72.0},
        ]
        
        mock_videos = [
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        ]
        
        feed = []
        for _ in range(limit):
            creator = random.choice(mock_creators)
            feed.append(SocialPost(
                id=str(uuid4()),
                creator_name=creator["name"],
                creator_avatar=creator["avatar"],
                video_url=random.choice(mock_videos),
                caption=f"Check out this amazing product! #{creator['name']}",
                product_id=str(uuid4()),
                product_title="Premium Tech Widget",
                product_price=random.choice([49.99, 129.50, 19.99, 299.00]),
                trust_score=creator["trust"],
                likes=random.randint(100, 50000)
            ))
            
        # Sort by Trust Score (High to Low) to enforce the "Community Trust" ranking
        feed.sort(key=lambda x: x.trust_score, reverse=True)
        
        return feed

social_service = SocialService()
