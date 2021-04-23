require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
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

const RED_EMOJI = ":red_circle:";
const YELLOW_EMOJI = ":large_yellow_circle:";
const GREEN_EMOJI = ":large_green_circle:";

const SMILE_EMOJI = ":smiley:";
const SHRUG_EMOJI = ":shrug:";
const GRIMACING_EMOJI = ":grimacing:"

const redResponse = `${RED_EMOJI} Oh no! ${GRIMACING_EMOJI}`;
const yellowResposne = `${YELLOW_EMOJI} Could be worse? ${SHRUG_EMOJI}`;
const greenResponse = `${GREEN_EMOJI} Happy to hear you're doing well! ${SMILE_EMOJI}`;

const messageJsonBlock = {
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "How are you doing today?"
			}
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

let redCount = 0, yellowCount = 0, greenCount = 0;

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
		redCount++;
		const { user, actions, response_url } = payload
    console.log("RED button click recieved: ", redCount, user.name, actions[0].action_id)
    sendResponse(response_url, redResponse);
  } catch (e) {
    console.error("Error: ", e)
  }
  return {
    text: 'Processing...',
  }
})
slackInteractions.action({ actionId: "button_yellow" }, async (payload) => {
  try {
		yellowCount++;
		const { user, actions, response_url } = payload
    console.log("YELLOW button click recieved: ", yellowCount, user.name, actions[0].action_id)
    sendResponse(response_url, yellowResposne);
  } catch (e) {
    console.error("Error: ", e)
  }
  return {
    text: 'Processing...',
  }
})
slackInteractions.action({ actionId: "button_green" }, async (payload) => {
  console.log(payload)
  try {
		greenCount++;
		const { user, actions, response_url } = payload
    console.log("GREEN button click recieved: ", greenCount, user.name, actions[0].action_id)
    sendResponse(response_url, greenResponse);
  } catch (e) {
    console.error("Error: ", e)
  }
  return {
    text: 'Processing...',
  }
})

function sendResponse(responseUrl, response) {
  console.log('response', responseUrl, response)
  request.post({url: responseUrl,
    method: 'POST',
    json: {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": response
          }
        }
      ]
    }
  });
}

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/slack-stoplight-responses', (req, res) => {
  res.send({
    data: [redCount, yellowCount, greenCount]
	});
});

// Starts server
app.listen(port, function() {
  console.log('Bot is listening on port ' + port)
})