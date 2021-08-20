import zipfile
import os

zipArray = [
	".nuxt",
	"server",
	"static",
	"nuxt.config.js",
	"package.json",
]

def zip_dirs(dirArray):
	pwd = os.getcwd()
	pwdName =  os.path.basename(pwd)
	zipfilename = pwdName + ".zip"
	z = zipfile.ZipFile(zipfilename,'w',zipfile.ZIP_DEFLATED)
	amount = float(0)
	count = 0
	for path in dirArray:
		if os.path.isdir(path) :
			for root, dirs, files in os.walk(path) :
				amount +=len(files)
				for file in files:
					fpath = root + os.sep + file
					z.write(fpath) 	
					count +=1					

		else :
			z.write(path)
			amount +=1
			count +=1   
		print ("\r" + str(count) + "/" + str(int(amount))) +"("+(str(round(count / amount * 100,2)))+"%)",


	z.close()
	print ('Finish')

if __name__ == '__main__':
	zip_dirs(zipArray)