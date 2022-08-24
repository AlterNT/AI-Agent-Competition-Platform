//View all games Agent X played in
MATCH (a:Agent {agentId:'agent1'}) -[:Plays_In]-> (g:Game)
RETURN a, g

//View the ID of all games played between on a specific date
MATCH (g:Game)
WHERE g.time CONTAINS "18/8/2022"
RETURN g.gameId

// View the source code of an Agent that has won more than 2 times
MATCH (g:Game)<-[p:Plays_In]-(a:Agent)
WHERE p.score = "1"
RETURN a.agentId AS AgentId, a.src AS SOURCECODE, COUNT(p.score) AS WINS

//View the Student Numbers of all Users who CONTROL more than 1 Agent
MATCH (u:User)-[:CONTROLS]-> (a:Agent)
RETURN u.studentNumber as Student, COUNT(a) as OwnedAgents