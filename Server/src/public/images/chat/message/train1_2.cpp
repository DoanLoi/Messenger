#include <iostream>
#include <cstring>
#include <math.h>
#include <bits/stdc++.h>
using namespace std;
struct Add
{
  long long vitri;
  int sl;
};
long long Time(struct Add a[],int n,int k){
	
	for(int i=0;i<n-1;i++){
		for (int j=0;j<n-i-1;j++)
		{   
			if(a[j].vitri>a[j+1].vitri)
			{
				struct Add tmp=a[j];
				a[j]=a[j+1];
				a[j+1]=tmp; 
			}
		}
    }
    
    long long time=0;
    long long i=n-1;
    long long du;
    
    while(i>-1)
    {   if(a[i].sl==0) 
      {
	    i--;
  	    continue;
	  }
	  
    
    	if(a[i].sl%k==0) 
    	{
    		du=0;
    	    time+=(a[i].sl/k)*a[i].vitri;
		}
    	else {
    		du=k-a[i].sl%k;
    		time+=((a[i].sl/k)+1)*a[i].vitri;
		}
    	long long j=i-1;
    	while(du!=0){
    		if(j<0) break;
    		
    		if  (a[j].sl <du)
    		{
    		
    			    du=du-a[j].sl;
    				a[j].sl=0;
    			    j --;
			}
			else {
				a[j].sl=a[j].sl-du;
				du=0;
			}
		}
		i--;
	}
	return time*2;
}
int main()
{    
  
	
	struct Add A[1000];
	struct Add B[1000];
	struct Add C[1000];
	long long vitri;
	long long sl;
	for(int i=0;i<n;i++)
	{
		cin>>vitri;
		cin>>sl;
		A[i].vitri=vitri;
		A[i].sl=sl;
	}
	int j=0,h=0;
		for(int i=0;i<n;i++)
	{
	 if(A[i].vitri>0) {
	 B[j]=A[i];
	 j++;
	}
	else 
	{
    A[i].vitri=abs(A[i].vitri);
	C[h]=A[i];
	h++;
    }
} 
   
   
	cout<<Time(B,j,k)+Time(C,h,k)<<endl;;

	
	
	return 0;
}
