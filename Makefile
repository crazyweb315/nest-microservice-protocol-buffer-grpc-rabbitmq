docker = docker-compose build  --no-cache
projects = micro_account

init:
	$(foreach project,$(projects),${docker} ${project})
	#make proto_build

proto_build:
	${docker} generic 		
