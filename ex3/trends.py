#!/usr/bin/python
import twitter as t
import json


# t = Twitter(auth=OAuth(
# 	token,
# 	token_secret,
# 	api_key,
# 	api_secret))

# my app tokens n' keys:
# api key pZ1GZrMRQRVTtOGHdOZ1IiVly
# api secret Fry547XRs7NnY35lYaCj8gm9YQCIDouKYUTZSVPswp0wGFLVc3
# access token 725626733886619648-3bKaxmKBnvVvsEKiY99fUWFNYEJYoqt
# access token secret nHO9gH1CXPOETmGBs0g23aI0r8xhmewS1ZByqbBCvf99A

api = t.Twitter(auth=t.OAuth(
	'725626733886619648-3bKaxmKBnvVvsEKiY99fUWFNYEJYoqt',
	'nHO9gH1CXPOETmGBs0g23aI0r8xhmewS1ZByqbBCvf99A',
	'pZ1GZrMRQRVTtOGHdOZ1IiVly',
	'Fry547XRs7NnY35lYaCj8gm9YQCIDouKYUTZSVPswp0wGFLVc3'))

WORLD_WOEID = 1
world_trends = api.trends.place(_id=WORLD_WOEID)


world_trends_set = set([trend['name']
 for trend in world_trends[0]['trends']])


try:
	trends_file = open('./trending_topics.json', "w")
except:
	sys.exit("ERROR. Couldn't open trends dataset file.")
	
trends_file.write(json.dumps(list(world_trends_set)))

