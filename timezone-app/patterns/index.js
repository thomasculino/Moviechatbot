const patternDict = [
{
  pattern: /\b(?<greeting>Hi|Hello|Hey|hello|hi)\b/i,
  intent: 'Hello'
}, 
{
  pattern: /\b(bye|exit|quit|leave|stop)\b/i,
  intent: 'Exit'
},
{
  pattern :/\b(time zone|time)\s(in)\s(?<city>\w+( \w+)?)/i,
  intent:"Time"
},
{
  pattern: /\b(help)\b/i,
  intent: "Help"
}];

module.exports = patternDict;