cls
"c:\Program Files (x86)"\"IronPython 2.7.1"\ipy64 "%*js\Hurricane\lib\Three\build.py" --canvas --minified

"c:\Program Files (x86)"\"IronPython 2.7.1"\ipy64 "%*js\Hurricane\lib\closure\bin\build\closurebuilder.py" ^
	 --root=..\js\Hurricane\ ^
	 --namespace="Hurricane" ^
	 --output_mode=compiled ^
	 --compiler_jar=..\js\Hurricane\lib\Three\compiler\compiler.jar ^
	 --compiler_flags="--compilation_level=WHITESPACE_ONLY" ^
	 > "%*js\Hurricane\Hurricane.js