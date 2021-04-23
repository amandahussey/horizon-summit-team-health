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

const managerId = 'C02081XNSN5';

// request.get({url: 'https://slack.com/api/conversations.list',
//   method: 'GET',
//   headers: {
//     'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
//   },
// }, (error, response, body) => {
//   if(error){
//     console.error(error)
//   }
//   console.log('conversations', JSON.parse(body))
  
// });

const RED_EMOJI = ":red_circle:";
const YELLOW_EMOJI = ":large_yellow_circle:";
const GREEN_EMOJI = ":large_green_circle:";

const SMILE_EMOJI = ":smiley:";
const SHRUG_EMOJI = ":shrug:";
const SAD_EMOJI = ":pensive:"

var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const today = new Date();
const day = weekday[today.getDay()]
const date = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`
const dateDisplay = `${day}, ${date}`

const redResponse = `Sorry to hear you're not doing great today. ${SAD_EMOJI} What can we do to help?`;
const yellowResponse = `Could be worse? ${SHRUG_EMOJI} What can we be doing better?`;
const greenResponse = `Yay! ${SMILE_EMOJI} What's been going well for you?`;

function generateNudge(color){
  let response;
  if(color === 'green') response = greenResponse;
  else if(color === 'yellow') response = yellowResponse;
  else if (color === 'red') response = redResponse;

  return [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": response
			}
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Leave Feedback",
						"emoji": true
					},
					"value": "click_me_123",
					"action_id": "open_modal_button"
				}
			]
		},
  ]
}

const modal = {
  "type": "modal",
  "callback_id": "modal_submit",
	"title": {
		"type": "plain_text",
		"text": "Title"
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "divider"
		},
		{
			"type": "input",
      "block_id": "modal_input_block",
			"element": {
				"type": "plain_text_input",
				"action_id": "plain_text_input_action"
			},
			"label": {
				"type": "plain_text",
				"text": "Label",
				"emoji": true
			}
		}
	]
}

slackInteractions.action({ actionId: 'open_modal_button' }, async (payload) => {
  try {
    await webClient.views.open({
      trigger_id: payload.trigger_id,
      view: modal
    })
   } catch (e)  {
     console.error(e)
   }
   return {
     text: 'Processing...',
   }
 })

slackInteractions.viewSubmission('modal_submit' , async (payload) => {
  const blockData = payload.view.state
  const input = blockData.values.modal_input_block.plain_text_input_action.value
  const { user } = payload;

  console.log('user', user)

  const messageRecieved = {
    "text": "Message received! We will pass this along to your manager.",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Message received! We will pass this along to your manager."
        }
      }
    ]
  }

  webClient.chat.postMessage({...messageRecieved, channel: user.id })

  let emoji;
  if(currentColor === 'red') emoji = RED_EMOJI;
  else if(currentColor === 'yellow') emoji = YELLOW_EMOJI;
  else if(currentColor === 'green') emoji = GREEN_EMOJI;
  

  const feedbackToManager = {
    "text": `Received feedback from ${user.name}`,
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*Feedback from ${user.name} on feeling ${emoji}*:\n_${input}_`
        }
      }
    ]
  }

  webClient.chat.postMessage({...feedbackToManager, channel: managerId })
  
  // postMessage(messageRecieved, user.id)
  // postMessage(feedbackToManager, managerId)

  return {
    response_action: "clear"
  }
})


const prompt = {
  "text": "How are you doing today?",
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
      ]
    }
  ]
}

const prompt2 = [
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
      {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": " :red_circle:",
          "emoji": true
        },
        "value": "red",
        "action_id": "button_red2"
      },
      {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": ":large_yellow_circle:",
          "emoji": true
        },
        "value": "yellow",
        "action_id": "button_yellow2"
      },
      {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": ":large_green_circle:",
          "emoji": true
        },
        "value": "green",
        "action_id": "button_green2"
      },
    ]
  }
]

// lions team health U01V260RDHT
// me U0203RM8NMP

const myUserId = 'U0203RM8NMP'

function postMessage(messageBlock, userId){
  const options = {
    method: 'POST',
    url: `https://slack.com/api/chat.postMessage?channel=${userId}&blocks=${JSON.stringify(messageBlock)}`,
    headers: {
      'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    },
  };
  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
    }
  }
  request(options, callback);
}

// postMessage(prompt, myUserId);
webClient.chat.postMessage({...prompt, channel: myUserId })

let redCount = 0, yellowCount = 0, greenCount = 0;
let currentColor;

slackEvents.on('app_mention', async (event) => {
  try {
    // const mentionResponseBlock = { ...messageJsonBlock, ...{channel: event.channel}}
    postMessage(prompt2, event.channel)
  } catch (e) {
    console.error("Error: ", e)
  }
})
slackInteractions.action({ actionId: 'open_modal_button' }, async (payload) => {
  try {
    console.log("modal button click recieved", payload)
  } catch (e) {
    console.error(e)
  }
  return {
    text: 'Processing...',
  }
})
slackInteractions.action({ actionId: "button_red" }, async (payload) => {
  try {
		redCount++;
    currentColor = 'red';
		const { user, actions, response_url } = payload
    console.log("RED button click recieved: ", redCount, user.name, actions[0].action_id)
    sendResponse(response_url, `*${dateDisplay}:* ${RED_EMOJI}`, 'red', user.id);
    const messageToManager = {
      "text": `${RED_EMOJI} for ${user.name} today`,
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*${user.name} has reported feeling:* ${RED_EMOJI}`
          }
        }
      ]
    }
    webClient.chat.postMessage({...messageToManager, channel: managerId })
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
    currentColor = 'yellow';
		const { user, actions, response_url } = payload
    console.log("YELLOW button click recieved: ", yellowCount, user.name, actions[0].action_id)
    sendResponse(response_url, `*${dateDisplay}:* ${YELLOW_EMOJI}`, 'yellow', user.id);
    const messageToManager = {
      "text": `${YELLOW_EMOJI} for ${user.name} today`,
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*${user.name} has reported feeling:* ${YELLOW_EMOJI}`
          }
        }
      ]
    }
    webClient.chat.postMessage({...messageToManager, channel: managerId })
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
    currentColor = 'green';
		const { user, actions, response_url } = payload
    console.log("GREEN button click recieved: ", greenCount, user.name, user.id, actions[0].action_id)
    sendResponse(response_url, `*${dateDisplay}:* ${GREEN_EMOJI}`, 'green', user.id);
    const messageToManager = {
      "text": `${GREEN_EMOJI} for ${user.name} today`,
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*${user.name} has reported feeling:* ${GREEN_EMOJI}`
          }
        }
      ]
    }
    webClient.chat.postMessage({...messageToManager, channel: managerId })
  } catch (e) {
    console.error("Error: ", e)
  }
  return {
    text: 'Processing...',
  }
})

slackInteractions.action({ actionId: 'open_modal_button' }, async (payload) => {
  try {
    console.log("modal button click recieved", payload)
  } catch (e) {
    console.error(e)
  }
  return {
    text: 'Processing...',
  }
})
slackInteractions.action({ actionId: "button_red2" }, async (payload) => {
  try {
		redCount++;
    currentColor = 'red';
		const { channel, response_url } = payload
    sendResponse(response_url, `*${dateDisplay}:* ${RED_EMOJI}`, 'red', channel.id);
  } catch (e) {
    console.error("Error: ", e)
  }
  return {
    text: 'Processing...',
  }
})
slackInteractions.action({ actionId: "button_yellow2" }, async (payload) => {
  try {
		yellowCount++;
    currentColor = 'yellow';
		const { channel, response_url } = payload
    sendResponse(response_url, `*${dateDisplay}:* ${YELLOW_EMOJI}`, 'yellow', channel.id);
  } catch (e) {
    console.error("Error: ", e)
  }
  return {
    text: 'Processing...',
  }
})
slackInteractions.action({ actionId: "button_green2" }, async (payload) => {
  console.log(payload)
  try {
		greenCount++;
    currentColor = 'green';
		const { channel, response_url } = payload
    sendResponse(response_url, `*${dateDisplay}:* ${GREEN_EMOJI}`, 'green', channel.id);
  } catch (e) {
    console.error("Error: ", e)
  }
  return {
    text: 'Processing...',
  }
})

function sendResponse(responseUrl, response, color, userId) {
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
        },
      ]
    }
  }, (error, response, body) => {
    if(error){
      console.error(error)
    }
    const messageResponse = generateNudge(color)
    postMessage(messageResponse, userId)
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