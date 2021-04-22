require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const { createEventAdapter } = require('@slack/events-api')
const { WebClient } = require('@slack/web-api')
const { createMessageAdapter } = require('@slack/interactive-messages')

const token = process.env.SLACK_BOT_TOKEN
const webClient = new WebClient(token)

const port = process.env.PORT || 3000
const app = express()

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET)
const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET)
    
app.use('/slack/events', slackEvents.expressMiddleware())
app.use('/slack/actions', slackInteractions.expressMiddleware())

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
  
});

const messageJsonBlock = {
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "How are you doing today?\n\n *Please select red, yellow, or green:*"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "actions",
			"elements": [
        // {
				// 	"type": "button",
				// 	"text": {
				// 		"type": "plain_text",
				// 		"text": " :large_blue_circle:",
				// 		"emoji": true
				// 	},
				// 	"value": "blue",
        //   "action_id": "button_blue"
				// },
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": " :red_circle:",
						"emoji": true
					},
					"value": "red",
          "action_id": "button_red"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": ":large_yellow_circle:",
						"emoji": true
					},
					"value": "yellow",
          "action_id": "button_yellow"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": ":large_green_circle:",
						"emoji": true
					},
					"value": "green",
          "action_id": "button_green"
				},
        // {
				// 	"type": "button",
				// 	"text": {
				// 		"type": "plain_text",
				// 		"text": " :large_orange_circle:",
				// 		"emoji": true
				// 	},
				// 	"value": "orange",
        //   "action_id": "button_orange"
				// },
			]
		}
	]
}

slackEvents.on('app_mention', async (event) => {
  try {
    const mentionResponseBlock = { ...messageJsonBlock, ...{channel: event.channel}}
    const res = await webClient.chat.postMessage(mentionResponseBlock)
    console.log('Message sent: ', res.ts)
  } catch (e) {
    console.error("Error: ", e)
  }
})

slackInteractions.action({ actionId: "button_red" }, async (payload) => {
  try {
    console.log("button click recieved", payload)
  } catch (e) {
    console.error("Error: ", e)
  }
  return {
    text: 'Processing...',
  }
})

// Starts server
app.listen(port, function() {
  console.log('Bot is listening on port ' + port)
})