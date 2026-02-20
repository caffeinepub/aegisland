import Runtime "mo:core/Runtime";

actor {
  public shared ({ caller }) func startPollRequest() : async () {
    Runtime.trap("Polling should never be called in main.loop actor. ");
  };
};
