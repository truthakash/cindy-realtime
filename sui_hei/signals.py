from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from twitter import OAuth, Twitter

from sui_hei.models import Puzzle

ENABLE_TWITTERBOT = settings.ENABLE_TWITTERBOT
TOKEN = settings.TOKEN
TOKEN_SECRET = settings.TOKEN_SECRET
CONSUMER_KEY = settings.CONSUMER_KEY
CONSUMER_SECRET = settings.CONSUMER_SECRET
TWEET_MESSAGE = settings.TWEET_MESSAGE


@receiver(post_save, sender=Puzzle)
def add_twitter_on_puzzle_created(sender, instance, created, **kwargs):
    if created and ENABLE_TWITTERBOT:
        auth = OAuth(CONSUMER_KEY, CONSUMER_SECRET, TOKEN, TOKEN_SECRET)
        t = Twitter(auth=auth)
        t.statuses.update(
            status=TWEET_MESSAGE % {
                'user_nickname': instance.user.nickname,
                'title': instance.title,
                'id': instance.id
            })
