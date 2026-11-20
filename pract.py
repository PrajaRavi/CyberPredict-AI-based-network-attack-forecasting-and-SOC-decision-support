counter=0
who_first={}
def fifo_page_rep(frame_size=3,page_list=[7,0,1,2,0,3,0,4,2,3]):
  global counter
  frames={}
  for page in page_list:
    if(len(frames)<frame_size):
        if(len(frames)==0):
           frames[page]="M"
           
        else:
           if(page in frames):
                #replacement algo

                pass
           else:
                frames[page]="M"
               

    else:
       pass
    who_first[page]=counter
    counter+=1


mydict={1:"hello",2:"ravi"}
print(1 in mydict) 
